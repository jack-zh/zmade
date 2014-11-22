var attachments = [
    {"name": "c.jpg", "url":"/zmde/static/attachments/c.jpg"},
    {"name": "fz.png", "url":"/zmde/static/attachments/fz.png"},
    {"name": "go.jpg", "url":"/zmde/static/attachments/go.jpg"},
    {"name": "link.png", "url":"/zmde/static/attachments/link.png"},
    {"name": "linux-c.jpg", "url":"/zmde/static/attachments/linux-c.jpg"},
    {"name": "linux.jpg", "url":"/zmde/static/attachments/linux.jpg"},
    {"name": "lua.png", "url":"/zmde/static/attachments/lua.png"},
    {"name": "me.png", "url":"/zmde/static/attachments/me.png"},
    {"name": "python.png", "url":"/zmde/static/attachments/python.png"},
    {"name": "rust.png", "url":"/zmde/static/attachments/rust.png"},
    {"name": "zlua.png", "url":"/zmde/static/attachments/zlua.png"}
  ];
var languageOverrides = {
  js: 'javascript',
  html: 'xml'
}

marked.setOptions({
  highlight: function(code, lang){
    if(languageOverrides[lang]) lang = languageOverrides[lang];
    return hljs.LANGUAGES[lang] ? hljs.highlight(lang, code).value : code;
  }
});

function update(e){
  var val = e.getValue();
  setOutput(val);
}

function setOutput(val){
  var _link_list = [];
  var _sl = val.split("\n");
  var set_num = 0;
  for (var i = 0; i < _sl.length; i++) {
    var _tmps = _sl[i];
    if(set_num == 2){
      _link_list.push(_tmps);
    }else{
      var __tmpss = _tmps.split("");
      if(__tmpss[0] == "@"){
        var __num = 0;
        for (var j = 0; j < __tmpss.length; j++) {
          if(__tmpss[j] == "@"){
            __num++;
          }else{
            break;
          }
        };
        if($.trim(_tmps).length == __num){
          set_num++;
        }
      }
      if(set_num == 0){
        _link_list.push(_tmps);
      }
    }
  }

  var _val = _link_list.join("\n");
  document.getElementById('out').innerHTML = marked(_val);
}

var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
  mode: 'markdown',
  lineNumbers: true,
  matchBrackets: true,
  lineWrapping: true,
  theme: 'default',
  onChange: update
});

document.addEventListener('drop', function(e){
  e.preventDefault();
  e.stopPropagation();

  var theFile = e.dataTransfer.files[0];
  var theReader = new FileReader();
  theReader.onload = function(e){
    editor.setValue(e.target.result);
  };

  theReader.readAsText(theFile);
}, false);


function jsonpcallback(data){
  backObj = JSON.parse(data)
  alert(backObj.success)
}

function markdown2data(code){
  var backObj = {};
  var _link_list = [];
  var _sl = code.split("\n");
  var set_num = 0;
  for (var i = 0; i < _sl.length; i++) {
    var _tmps = _sl[i];
    if(set_num == 2){
      _link_list.push(_tmps);
    }else{
      var adddflag = false;
      var __tmpss = _tmps.split("");
      if(__tmpss[0] == "@"){
        var __num = 0;
        for (var j = 0; j < __tmpss.length; j++) {
          if(__tmpss[j] == "@"){
            __num++;
          }else{
            break;
          }
        };
        if($.trim(_tmps).length == __num){
          set_num++;
          adddflag = true;
        }
      }
      if(set_num == 0){
        _link_list.push(_tmps);
      }else{
        if(!adddflag){
          if(__tmpss[0] == "@"){
            __tmpss.shift(0);
            var key_val_list = __tmpss.join("").split(":");
            if(key_val_list.length > 1 && $.trim(key_val_list[0]).length > 0){
              var key_val_key = $.trim(key_val_list[0]);
              key_val_list.shift(0);
              var key_val_val = $.trim(key_val_list.join(":"));
              backObj[key_val_key] = key_val_val;
            }
          }
        }
      }
    }
  }
  backObj["makedown_str"] = _link_list.join("\n");
  // backObj["code"] = code;
  return backObj;
}

function save2webdatabase(code){

}

function save(){
  var code = editor.getValue();
  var data = markdown2data(code);
  save2webdatabase(code);

  if(data.url){
    var url = data.url;
    delete data.url;
    console.log(data);
    console.log(url);
    $.ajax({
      url: url,
      dataType: 'jsonp',
      jsonp: "jsonpcallback",
      data: data,
      async: false
    });
  }
}

function attachmentDialog(){
  var html = "<ul class='attachments-ul'>";
  for (var i = attachments.length - 1; i >= 0; i--) {
    html += "<li class='copy'><p><a target='_blank' href='"+ attachments[i]['url'] +"'>" + attachments[i]['name'] + ":</a></p><p>" + attachments[i]['url'] + "</p></li>";
  };
  html += "</ul>"
  var d = dialog({
    title: 'Attachments',
    content: html
  });
  d.show();
}

document.addEventListener('keydown', function(e){
  if(e.keyCode == 83 && (e.ctrlKey || e.metaKey)){
    e.preventDefault();
    save();
    return false;
  }

  if(e.keyCode == 66 && (e.ctrlKey || e.metaKey)){
    e.preventDefault();
    attachmentDialog();
    return false;
  }
})

update(editor);
editor.focus();

var GoSquared = { acct: 'GSN-265185-D' };