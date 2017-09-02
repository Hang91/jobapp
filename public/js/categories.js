////////////////////////////////////////////////////////////////////////////
// categories.js ///////////////////////////////////////////////////////////
///////////////////
var TypesModel = {
    employmentType: ""
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
        if(addConfirm()){
            var type = $(this).parent().parent().parent().children().find("input").val();
            //alert(type);
            //$(".addsave").removeClass("addsave");
            var addurl = document.getElementById('addurl'); 
            //or grab it by tagname etc
            addurl.href = "/manage/categories/add?employmentType="+type;
        }
  });
});

function addConfirm() {
　　　　if (window.confirm("Confirm to add this employment type?")) {
　　　　　　return true;//confirm
　　　　}
　　　　else {
　　　　　　return false;//cancel
　　　　}
}



function editType(index) {
      var $tds = $(".edit_"+index).parents("tr").children("td").not(":first,:last");
      //check button is edit or save
      var $content = $(".edit_"+index).html();
      if ($content=="Edit") {
        //if button is edit, add input tag to every corresponding td        
          $tds.each(function(){
              $(this).html("<input type='text' value='"+$(this).html()+"'>");
          });
          $(".edit_"+index).html("Save")
      }else{
          if(editConfirm()){
              var $tds = $(".edit_"+index).parents("tr").children("td").not(":first,:last");
              $tds.each(function(){
                    var idOrType= $($tds).children("input").val();
                    $(this).html(idOrType);
              });
              id = document.getElementById('id_'+index).innerHTML;
              type = document.getElementById('type_'+index).innerHTML;
              $(".edit_"+index).html("Edit")
              //var type = $(this).parent().parent().parent().children().find("input").val();
                
              var editurl = document.getElementById('editurl_'+index); 
              editurl.href = "/manage/categories/edit?_id="+id+"&&employmentType="+type.toString();
              //alert(editurl.href);
        }
      }
}

function editConfirm() {
　　　　if (window.confirm("Confirm to change this employment type?")) {
　　　　　　return true;//confirm
　　　　}
　　　　else {
　　　　　　return false;//cancel
　　　　}
}


function deleteType(index) {
      // alert('id_'+index);
      // alert(document.getElementById('id_'+index).innerHTML);
　　　　if (deleteConfirm()) {
          var deleteurl = document.getElementById('deleteurl_'+index);
          var id = document.getElementById('id_'+index).innerHTML;
          //alert("delete type:"+id);
          deleteurl.href="/manage/categories/delete?_id="+id;
　　　　}
}


function deleteConfirm() {
　　　　if (window.confirm("Confirm to delete this employment type?")) {
　　　　　　return true;//confirm
　　　　}
　　　　else {
　　　　　　return false;//cancel
　　　　}
}