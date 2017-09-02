//manage_jobs

//revise: admin / users
//event already approved
function confirmJobInDetail(){
    var confirm = document.getElementById('confirm');
    confirm.type="submit";
}



function reviseInDetail(){
  if (reviseConfirm()) {
　　　　　　//删除操作
          var revise = document.getElementById('revise');
　　　　　　alert("Revised");
          revise.type="submit";
　　　　}
}

function reviseConfirm() {
　　　　if (window.confirm("Confirm to revise this job?")) {
　　　　　　return true;//confirm
　　　　}
　　　　else {
　　　　　　return false;//cancel
　　　　}
　　}

//only admin
//approve
function approveJobInDetail() {
　　　　if (approveConfirm()) {
　　　　　　//approve
          var approve = document.getElementById('approve');
　　　　　　alert("Approved");
          approve.type="submit";
　　　　}
　　}
  

function approveJob(index) {
　　　　if (approveConfirm()) {
　　　　　　//approve
          var approve = document.getElementById('approve_'+index);
　　　　　　alert("Approved");
          var id = document.getElementById('id_'+index).innerHTML;
          approve.href = "/manage/jobs/approve?id="+id;
　　　　}
　　}

  function approveConfirm() {
　　　　if (window.confirm("Confirm to approve this job?")) {
　　　　　　return true;//confirm
　　　　}
　　　　else {
　　　　　　return false;//cancel
　　　　}
　　}

//disapprove
function disapprovejobInDetail() {
  　　　　if (disapproveConfirm()) {
  　　　　　　//disapprove operation
            var disapprove = document.getElementById('disapprove');
  　　　　　　alert("Disapproved");
            disapprove.type="submit";
  　　　　}
}


  function disapproveJob(index) {
　　　　if (disapproveConfirm()) {
          var disapprove = document.getElementById('disapprove_'+index);
          var id = document.getElementById('id_'+index).innerHTML;           
　　　　　　//alert("Disapproved id="+id+", index="+index);
          alert("Disapproved");
          disapprove.href = "/manage/jobs/disapprove?id="+id;
　　　　}
　　}
  function disapproveConfirm() {
　　　　if (window.confirm("Confirm to disapprove this job?")) {
　　　　　　return true;//confirm
　　　　}
　　　　else {
　　　　　　return false;//cancel
　　　　}
　　}

//only users
function deleteJob(index) {
　　　　if (deleteConfirm()) {
          var delete_job = document.getElementById('delete_'+index);
          var id = document.getElementById('id_'+index).innerHTML;           
　　　　　　//alert("Disapproved id="+id+", index="+index);
          alert("Deleted!");
          delete_job.href = "/users/deleteJob?id="+id;
　　　　}
　　}
  function deleteConfirm() {
　　　　if (window.confirm("Confirm to delete this job?")) {
　　　　　　return true;//confirm
　　　　}
　　　　else {
　　　　　　return false;//cancel
　　　　}
　　}

