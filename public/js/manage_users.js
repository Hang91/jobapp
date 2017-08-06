//manage_users.js
//only admin
//promote
  

function promoteUser(index) {
　　　　if (promoteConfirm()) {
　　　　　　//promote操作
          var promote = document.getElementById('promote_'+index);
　　　　　　alert("Promoted");
          var id = document.getElementById('id_'+index).innerHTML;
          promote.href = "/manage/users/promote?id="+id;
　　　　}
　　　　else {
　　　　　　//取消返回
　　　　　　//alert("Canceled");
　　　　}
　　}

  function promoteConfirm() {
　　　　if (window.confirm("Confirm to promote this user to manager?")) {
　　　　　　return true;//confirm
　　　　}
　　　　else {
　　　　　　return false;//cancel
　　　　}
　　}

//demote
  function demoteUser(index) {
　　　　if (demoteConfirm()) {
          var demote = document.getElementById('demote_'+index);
          var id = document.getElementById('id_'+index).innerHTML;           
　　　　　　alert("Disapproved id="+id+", index="+index);
          alert("Demoted");
          demote.href = "/manage/users/demote?id="+id;
　　　　}
　　　　else {
　　　　　　//取消返回
　　　　　　//alert("Canceled");
　　　　}
　　}
  function demoteConfirm() {
　　　　if (window.confirm("Confirm to demote this manager to user?")) {
　　　　　　return true;//confirm
　　　　}
　　　　else {
　　　　　　return false;//cancel
　　　　}
　　}