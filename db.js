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
  var datas=[];
  for (var i in data) {
    data[i].key=i;
    datas.push(data[i]);
  }
  datas.reverse();
  //console.log(datas);
  for(var items in datas){
      dataHtml+=CreateNewToDoList(datas[items].Content,datas[items].key,datas[items].Alert,datas[items].Dateline,datas[items].Status);
      //console.log(dataHtml);            
  }
  $(".list-body").html(dataHtml);
});