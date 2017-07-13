////////////////////////////////////////////////////////////////////////////
// categories.js ///////////////////////////////////////////////////////////
///////////////////
var TypesModel = {
    type: ""
};

function resetIndex(){
//calculate No.
      $("tr>td:first-child").each(function(index,element){
          $(this).html(index+1)
      })
};




//add
$(function (){
    //click to add, change it to editable style and change 'edit' button to 'save'
  $(".add").on("click", function () {
        //01 copy
          var $tr = $(".hid").clone(true);
          //disply=block
          $tr.removeClass("hid");
          //change edit to save
          //$tr.find("button:contains(Edit)").html("Save");
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
        var type = $(this).parent().parent().parent().children().find("input").val();
        //alert(type);
        //$(".addsave").removeClass("addsave");
        var addurl = document.getElementById('addurl'); 
        //or grab it by tagname etc
        addurl.href = "/manage/categories/add?type="+type;
        
        //use Ajax to update data
        // $.ajax({
        //     type: 'post',
        //     url: "/manage/categories/add",
        //     dataType: "json",
        //     data: TypesModel,
        //     success: function (resData) {
        //         if (resData.result == 1) {
        //             //refresh table
        //             alert('Add success!');

        //             $(this).html("Edit")
        //         }
        //     },
        //     error: function (error) {
        //         alert('Add error!');
        //     }
        // });
        //?Manage Categories: <%=results.length%> should +1
  });
});





$(function (){
  $(".edit").on("click", function(){
      var $tds = $(this).parents("tr").children("td").not(":first,:last");
      //check button is edit or save
      var $content = $(this).html();
      if ($content=="Edit") {
        //if button is edit, add input tag to every corresponding td        
          $tds.each(function(){
              $(this).html("<input type='text' value='"+$(this).html()+"'>");
          });
          $(this).html("Save")
      }else{
          alert("Confirm to change this type?");
          var $tds = $(this).parents("tr").children("td").not(":first,:last");
          $tds.each(function(){
                var idOrType= $($tds).children("input").val();
                $(this).html(idOrType);
              //update mongoDB database              
          });
          id = document.getElementById('id').innerHTML;
          type = document.getElementById('type').innerHTML;
          //alert(id);
          $(this).html("Edit")
          //var type = $(this).parent().parent().parent().children().find("input").val();
            
          var editurl = document.getElementById('editurl'); 
          editurl.href = "/manage/categories/edit?_id="+id+"&&type="+type.toString();
          //alert(editurl.href);
      }
  })
})


$(function (){
    //click to add, change it to editable style and change 'edit' button to 'save'
  $(".delete").on("click", function () {
        alert("Confirm to delete this type?");
  })
})