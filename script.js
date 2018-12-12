$(document).ready(function () {
    //當設置提醒開關的switch被打開時，就把時間的input enable
    $("#AlertSwitch").on('click', function (e) {
        e.preventDefault();
        let last_status = $(this).attr("aria-pressed");
        if (last_status == "true") {//切換為false時
            $("#timer").attr("disabled", true);
        }
        else { //切換為true
            $("#timer").removeAttr("disabled");
        }
        //console.log("status:"+status);
    });
    //新增一個代辦事項
    $(".add-card").on('click', function (e) {       
        let body = $(this).parent().siblings(".modal-body");
        let content = body.find(".Todo-Content");
        let btn_Mode = $(this).attr("data-Mode");
        let AlertSwitch = $('#AlertSwitch');//Dateline開關
        let Time = $('#timer');
        
        //console.log(Time.val()+";"+AlertSwitch.attr("aria-pressed"));
        let data = {
            Content: content.val(),
            Status:"normal"
        };
        if (AlertSwitch.attr("aria-pressed") == "true") { //如果有要求設定鬧鐘
            data.Alert = true;
            if (Time.val() != "") {
                data.Dateline = Time.val();
            }
            else {
                data.Alert = false;
            }
        }
        else {//如果沒要求設定鬧鐘
            data.Alert = false;
        }
        if (btn_Mode == "Edit") {
            let modal = $("#EditModal").attr("data-key");
            let obj = database.ref('todos/' + modal);
            obj.set(data);

        }
        else if (btn_Mode == "New") {
            todos.push(data);
        }
        content.val("");
        Time.val("");
    });
    //刪除TodoList
    $(".list-body").on('click', ".btn-delete", function (e) {
        //console.log('close');
        let close_btn = $(this);
        let card = close_btn.parents(".col-md-4");
        //console.log(card.data("key"));
        //從資料庫內刪除
        todos.child(card.data("key")).remove();
        //card.remove();

    });
    //編輯按鈕
    $(".list-body").on('click', ".btn-edit", function (e) {
        let edit_btn = $(this);
        let card = edit_btn.parents(".col-md-4");
        let content = $("#Todo-Content");
        let Timer = $("#timer");
        let obj = database.ref('todos/' + card.data("key"));
        $('#EditModal').attr("data-key", card.data("key"));
        obj.once('value', function (snapshot) {
            var data = snapshot.val();
            content.val(data.Content);
            Timer.val(data.Dateline);
        });
    });

    //根據不同按鈕來改寫modal的標題與內容
    $('#EditModal').on('show.bs.modal', function (event) {
        SetMinDate();
        var btn = $(event.relatedTarget);
        var title = btn.data('title');
        var modal = $(this);
        if (title == "new") {
            modal.find('.modal-title').text("新增待辦事項");
            modal.find('.add-card').text("新增");
            modal.find('.add-card').attr("data-Mode", "New");
            modal.find("#Todo-Content").val("");
            modal.find('#timer').val("");
        }
        else if (title == "edit") {
            modal.find('.modal-title').text("編輯待辦事項");
            modal.find('.add-card').text("儲存");
            modal.find('.add-card').attr("data-Mode", "Edit");
        }
    });
    // 完成按鈕
    $(".list-body").on('click', ".btn-finish", function (e) {
        let btn = $(this);
        let btnState = btn.attr("data-pressed");
        let card = $(this).parents('.card');
        //取得目前操作的元件key值
        let card_key=$(this).parents('.col-md-4').data("key");
        let obj=database.ref('todos/'+card_key+"/Status");
        console.log(btn.data('pressed'));
        //console.log(card);
        if (btnState == "false") {
            btn.data("pressed", true);
            // console.log("false:"+btn.attr("data-pressed"));
            $(this).addClass("text-success");
            card.addClass("shadow-success");
            obj.set("done");
        }
        else {
            btn.data("pressed", false);
            // console.log("true:"+btn.attr("data-pressed"));
            $(this).removeClass("text-success");
            card.removeClass("shadow-success");
            obj.set("nomal");
        }
        // $(this).toggleClass("text-success");
        // card.toggleClass("shadow-success"); //新增淡綠色shadow
    });

});
//用來新建一個Card
function CreateNewToDoList(content, key, clock, time,status) {
    let Outline = $("<div></div>");
    let NewCard = $("<div></div>").addClass("col-md-4").addClass("py-3").attr("data-key", key);
    //NewCard.data("key",key);
    //console.log(NewCard.data("key"));
    NewCard.append($("<div></div>").addClass("card").addClass("h-100"));
    let Card = NewCard.children();
    if(status=="done"){
        Card.addClass("shadow-success");
    }
    else if(status=="delay"){
        Card.addClass("shadow-danger");
    }
    Card.append($("<div></div>").addClass("card-header").addClass("d-flex"));
    Card.append($("<div></div>").addClass("card-body"));
    let CardHeader = Card.children(".card-header"); //CardTittle
    let CardBody = $(Card.children(".card-body")); //Card主要內容

    //帶入使用者輸入的標題

    CardHeader.append($("<div></div>").addClass("todo-title"));
    //如果有設定期限就新增鬧鐘圖示上去
    if (clock) {
        CardHeader.children('.todo-title').append($("<a></a>").addClass("btn").addClass("btn-sm").addClass("pr-0").addClass("btn-clock").text(time));
        CardHeader.find(".btn-clock").prepend($("<i></i>").addClass("far").addClass("fa-clock").addClass("mr-2"));
    }
    //console.log(CardHeader);
    //創建TodoList操作button
    CardHeader.append($("<div></div>").addClass("ml-auto"));
    let btns = CardHeader.children(".ml-auto");
    //btns.append($("<a></a>").addClass("btn").addClass("btn-sm").addClass("pr-0").addClass("btn-finish"));
    if(status=="done"){
        btns.append($("<a></a>").addClass("btn").addClass("btn-sm").addClass("pr-0").addClass("btn-finish").addClass("text-success").attr("data-pressed", true));
    }
    else{
        btns.append($("<a></a>").addClass("btn").addClass("btn-sm").addClass("pr-0").addClass("btn-finish").attr("data-pressed", false));
    }
    btns.append($("<a></a>").addClass("btn").addClass("btn-sm").addClass("pr-0").addClass("btn-edit"));
    btns.append($("<a></a>").addClass("btn").addClass("btn-sm").addClass("pr-0").addClass("btn-delete"));

    //加入按鈕圖示
    btns.children(".btn-edit").append($("<i></i>").addClass("far").addClass("fa-edit")).attr("data-title", "edit").attr("data-toggle", "modal").attr("data-target", "#EditModal");
    btns.children(".btn-delete").append($("<i></i>").addClass("fas").addClass("fa-times"));
    btns.children(".btn-finish").append($("<i></i>").addClass("fas").addClass("fa-check"));
    //帶入使用者所輸入內容
    CardBody.append($("<p></p>").addClass("card-text").text(content));
    Outline.append(NewCard);
    //console.log(NewCard.data("key"));
    //console.log(Outline.html());
    return Outline.html();
}
//設定input 最小時間
function SetMinDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var hour=today.getHours();
    var min=today.getMinutes();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    if (hour < 10) {
        hour = '0' + hour
    }
    if (hour < 10) {
        hour = '0' + hour
    }
    today = yyyy + '-' + mm + '-' + dd+"T"+hour+":"+min;
    console.log(today);
    $("#timer").attr("min", today);
}