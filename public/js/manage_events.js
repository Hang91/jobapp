//manage_events

//revise: admin / users
function reviseInDetail(){
  if (reviseConfirm()) {
　　　　　　//删除操作
          var revise = document.getElementById('revise');
　　　　　　alert("Asked for Revision");
          revise.type="submit";
　　　　}
　　　　else {
　　　　　　//取消返回
　　　　　　//alert("Canceled");
　　　　}
}

function reviseConfirm() {
　　　　if (window.confirm("Confirm to ask for revision about this event?")) {
　　　　　　return true;//confirm
　　　　}
　　　　else {
　　　　　　return false;//cancel
　　　　}
　　}

//only admin
//approve
function approveEventInDetail() {
　　　　if (approveConfirm()) {
　　　　　　//approve操作
          var approve = document.getElementById('approve');
　　　　　　alert("Approved");
          approve.type="submit";
　　　　}
　　　　else {
　　　　　　//取消返回
　　　　　　//alert("Canceled");
　　　　}
　　}
  

function approveEvent(index) {
　　　　if (approveConfirm()) {
　　　　　　//approve操作
          var approve = document.getElementById('approve_'+index);
　　　　　　alert("Approved");
          var id = document.getElementById('id_'+index).innerHTML;
          approve.href = "/manage/events/approve?id="+id;
　　　　}
　　　　else {
　　　　　　//取消返回
　　　　　　//alert("Canceled");
　　　　}
　　}

  function approveConfirm() {
　　　　if (window.confirm("Confirm to approve this event?")) {
　　　　　　return true;//confirm
　　　　}
　　　　else {
　　　　　　return false;//cancel
　　　　}
　　}

//disapprove
function disapproveEventInDetail() {
  　　　　if (disapproveConfirm()) {
  　　　　　　//删除操作
            var disapprove = document.getElementById('disapprove');
  　　　　　　alert("Disapproved");
            disapprove.type="submit";
  　　　　}
  　　　　else {
  　　　　　　//取消返回
  　　　　　　//alert("Canceled");
  　　　　}
}


  function disapproveEvent(index) {
　　　　if (disapproveConfirm()) {
          var disapprove = document.getElementById('disapprove_'+index);
          var id = document.getElementById('id_'+index).innerHTML;           
　　　　　　//alert("Disapproved id="+id+", index="+index);
          alert("Disapproved");
          disapprove.href = "/manage/events/disapprove?id="+id;
　　　　}
　　　　else {
　　　　　　//取消返回
　　　　　　//alert("Canceled");
　　　　}
　　}
  function disapproveConfirm() {
　　　　if (window.confirm("Confirm to disapprove this event?")) {
　　　　　　return true;//confirm
　　　　}
　　　　else {
　　　　　　return false;//cancel
　　　　}
　　}

//only users
function deleteEvent(index) {
　　　　if (deleteConfirm()) {
          var delete_event = document.getElementById('delete_'+index);
          var id = document.getElementById('id_'+index).innerHTML;           
　　　　　　//alert("Disapproved id="+id+", index="+index);
          alert("Deleted!");
          delete_event.href = "/users/deleteEvent?id="+id;
　　　　}
　　　　else {
　　　　　　//取消返回
　　　　　　//alert("Canceled");
　　　　}
　　}
  function deleteConfirm() {
　　　　if (window.confirm("Confirm to delete this event?")) {
　　　　　　return true;//confirm
　　　　}
　　　　else {
　　　　　　return false;//cancel
　　　　}
　　}

