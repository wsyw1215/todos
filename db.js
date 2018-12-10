// 連接至firebase
var config = {
  apiKey: "AIzaSyCZCP6CWvNHFO9rIV2FDJJ9okTLqO_mTIQ",
  authDomain: "todolist-58363.firebaseapp.com",
  databaseURL: "https://todolist-58363.firebaseio.com",
  projectId: "todolist-58363",
  storageBucket: "todolist-58363.appspot.com",
  messagingSenderId: "419820849214"
};
firebase.initializeApp(config);
var database=firebase.database();
var todos=database.ref('todos');
// 資料庫畫面更新
todos.on('value',function(snapshot){
  var data=snapshot.val();
  let dataHtml="";
  for(var items in data){
      dataHtml+=CreateNewToDoList(data[items].Content,items,data[items].Alert,data[items].Dateline);
      //console.log(dataHtml);            
  }
  $(".list-body").html(dataHtml);
});