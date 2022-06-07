$(function() {
    // 2.1 导入layer
    var layer = layui.layer;
    // 4.1.4 导入form
    var form = layui.form;
    // 1. 获取并使用模板引擎渲染表格的数据 
    initArtCateList(); // 调用函数获取列表
    // 1.1获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // 1.2 定义字符串接收模板数据
                var htmlStr = template('tpl-table', res);
                // 1.3 将数据渲染到页面上
                $('tbody').html(htmlStr);
            }
        });
    }
    // 2.添加弹出层的添加功能
    // 2.1 展示添加层：为添加类别按钮绑定点击事件
    var indexAdd = null; // 3.2.4预先保存弹出层的索引
    $('#btnAddCate').on('click', function() {
        // 2.1.1 调用layer.open()
        indexAdd = layer.open({ // 3.2.5 打开弹出层赋值给索引
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(), // 把定义好的form结构渲染到页面上
        });
    });
    // 2.2 输入内容添加功能：实现添加文章分类的功能
    // 注意：通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        // 2.2.1阻止默认行为
        e.preventDefault();
        // 2.2.2 发起ajax请求：新增分类
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }
                // 2.2.3获取列表调用1函数
                initArtCateList();
                layer.msg('新增分类成功！');
                // 2.2.6根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        });
    });
    // 4.编辑按钮的编辑功能
    // 4.3.3 预先保存编辑弹出层的索引
    var indexEdit = null;
    // 4.1点击编辑展示弹出层及数据：通过代理的形式，为 btn-edit 按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function() {
        // 4.1.1弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        });
        // 4.1.2 获取id
        var id = $(this).attr('data-id');
        // 4.1.3 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // 4.1.5 快速获取表单值
                form.val('form-edit', res.data);
            }
        });
    });
    // 4.3 修改功能：通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        // 4.3.1 阻止默认行为
        e.preventDefault();
        // 4.3.2 发起更新列表请求
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(), //快速拿到当前表单中的数据
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                }
                layer.msg('更新分类数据成功！');
                // 4.3.4 修改完后自动关闭
                layer.close(indexEdit);
                // 4.3.5 获取更新数据
                initArtCateList();
            }
        });
    });
    // 5.删除按钮
    // 5.1 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // 5.1.1 获取id
        var id = $(this).attr('data-id');
        // 5.2 弹出层：提示询问是否要删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            // 5.3 删除功能：发起ajax请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index); // 关闭弹出层
                    initArtCateList(); // 更新列表
                }
            });
        });
    });
});