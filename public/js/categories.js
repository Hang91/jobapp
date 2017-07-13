////////////////////////////////////////////////////////////////////////////
// categories.js ///////////////////////////////////////////////////////////
///////////////////
var TypesModel = {
    type: ""
};

function resetIndex(){
//计算序号
      $("tr>td:first-child").each(function(index,element){
          $(this).html(index+1)
      })
};




//add
$(function (){
    //click to add, change it to editable style and change 'edit' button to 'save'
  $(".add").on("click", function () {
        //01 克隆
          var $tr = $(".hid").clone(true);
          //disply=block
          $tr.removeClass("hid");
          //把修改按钮的值为保存
          $tr.find("button:contains(Edit)").html("Save");
          //02 after()
          $(this).closest("tr").after($tr);
          resetIndex();
  });
});

//addsave
$(function (){
    //click to add, change it to editable style and change 'edit' button to 'save'
  $(".addsave").on("click", function () {
        alert("Confirm to add this type?");
        //构造数据类
        TypesModel.type = $(this).parent().parent().children().find("input").val();
        console.log(TypesModel.type);
        $(".addsave").removeClass("addsave");
        //use Ajax to update data
        $.ajax({
            type: 'get',
            url: "/manage/categories/add",
            dataType: "json",
            data: TypesModel,
            success: function (resData) {
                if (resData.result == 1) {
                    //refresh table
                    alert('Add success!');

                    $(this).html("Edit")
                }
            },
            error: function (error) {
                alert('Add error!');
            }
        });
  });
});





$(function (){
  $(".edit").on("click", function(){
      //可操作的全部区域
      var $tds = $(this).parents("tr").children("td").not(":first,:last");
      //点击修改按钮的时候，先判定是修改还是保存
      var $content = $(this).html();
      if ($content=="Edit") {
      //如果是修改,给每个操作的td添加一个input标签        
          $tds.each(function(){
              $(this).html("<input type='text' value='"+$(this).html()+"'>");
          });
          $(this).html("Save")
      }else{
      //如果是保存,将修改的内容保存下来
          $tds.each(function(){
              var newtype= $(this).children("input").val()
              $(this).html(newtype);
              //update mongoDB database
              
          });
          $(this).html("Edit")
      }
  })
})