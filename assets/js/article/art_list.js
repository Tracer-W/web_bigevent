$(function() {
    // 导入layer
    var layer = layui.layer;
    // 导入form
    var form = layui.form;
    // 6.1 从layui上导出一个laypage对象
    var laypage = layui.laypage;
    // 3.定义美化时间格式的过滤器
    template.defaults.imports.dataFormat = function(date) {
        // 3.1 根据给定的时间date，new一个时间对象
        const dt = new Date(date);
        // 3.3 美化
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };
    // 3.2定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 1.定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    };
    // 2.3调用请求文章列表函数
    initTable();
    // 4.5 调用分类选项
    initCate();
    // 2.请求文章列表数据并使用模板引擎渲染列表结构
    function initTable() { // 2.1获取文章列表数据的方法
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！'); // 前提要先导入layer
                }
                // 2.2使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页方法
                renderPage(res.total);
            }
        });
    }
    // 4.发起请求获取并渲染文章分类的下拉选择框 初始化文章分类的方法：
    function initCate() {
        // 4.1 发起ajax请求获取分类列表
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                // 4.2 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                // 4.3 通过select的id选择器拿到下拉菜单，并把数据渲染到页面
                $('[name=cate_id]').html(htmlStr);
                // 4.4 调用form.render()方法（先导入form）通知layui重新渲染表单选项
                form.render();
            }
        });
    }
    // 5.筛选功能：为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
        // 5.1 阻止默认行为
        e.preventDefault();
        // 5.2 获取表单两个下拉框中选好的选项值：通过name属性
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 5.3给查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 5.4 根据最新的筛选条件，重新渲染表格的数据
        initTable();
    });
    // 6.定义渲染分页的方法
    function renderPage(total) {
        // 6.2调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            // 6.2.1 主要数据
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 自定义功能
            limits: [2, 3, 5, 10], // 每页条数的选择项。如果 layout 参数开启了 limit，则会出现每页条数的select选择框
            // 6.2.2 分页发生切换的时候，触发 jump 回调
            jump: function(obj, first) {
                // 6.2.2-1把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 6.2.2-3把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit;
                // 6.2.2-2根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable(); //不能直接调用获取表格的方法，会发生死循环
                if (!first) {
                    initTable();
                }

            }
        });
    }
    // 7.删除文章：通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // 7.2.1 获取删除按钮的个数
        var len = $('.btn-delete').length;
        // 7.1.2通过自定义属性获取到文章的 id
        var id = $(this).attr('data-id');
        // 7.1 弹出层：询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({ // 7.1.1发起请求根据id删除文章
                method: 'GET',
                url: '/my/article/delete/' + id, // 先获取id
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    // 7.3 解决bug
                    // 7.3.2 判断删除按钮的个数
                    if (len === 1) { // 如果 len 的值等于1，则证明再次点击删除,且删除完毕之后，页面上就没有任何数据了,所以给页码赋值操作(注意:页码值最小必须是 1)
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    // 7.1.3 重新获取列表->7.3.3重新获取列表
                    initTable();
                }
            });
            // 7.2 删除后关闭弹出层
            layer.close(index);
        })
    })
});