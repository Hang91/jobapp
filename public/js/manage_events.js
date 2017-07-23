//manage_events

//approve
  function approveEvent(index) {
　　　　if (approveConfirm()) {
　　　　　　//删除操作
          var approve = document.getElementById('approve_'+index);
　　　　　　alert("Approved");
          var id = document.getElementById('id_'+index).innerHTML;
          approve.href = "/manage/events/approve?id="+id;
　　　　}
　　　　else {
　　　　　　//取消返回
　　　　　　alert("Canceled");
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
  function disapproveEvent(index) {
　　　　if (disapproveConfirm()) {
          var disapprove = document.getElementById('disapprove_'+index);
          var id = document.getElementById('id_'+index).innerHTML;           
　　　　　　alert("Disapproved");
          disapprove.href = "/manage/events/disapprove?id="+id;
　　　　}
　　　　else {
　　　　　　//取消返回
　　　　　　alert("Canceled");
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