var attachments = [
    {"name": "a.jpg", "url":"/static/attachments/a.jpg"},
    {"name": "b.jpg", "url":"/static/attachments/b.jpg"},
    {"name": "c.jpg", "url":"/static/attachments/c.jpg"},
    {"name": "d.jpg", "url":"/static/attachments/d.jpg"},
    {"name": "e.jpg", "url":"/static/attachments/e.jpg"},
    {"name": "f.jpg", "url":"/static/attachments/f.jpg"},
    {"name": "g.jpg", "url":"/static/attachments/g.jpg"},
    {"name": "h.jpg", "url":"/static/attachments/h.jpg"}
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
      if(_tmps.length > 1){
        var __tmpss = _tmps.split("");
        if(__tmpss[0] == "@"){
          if(__tmpss[0] == "@" && __tmpss[1] == "@"){
            set_num++;
          }
        }else{
          _link_list.push(_tmps);
        }
      }else{
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

function save(){
  var code = editor.getValue();
  alert(code);
}

function attachmentDialog(){
  var html = "<ul>";
  for (var i = attachments.length - 1; i >= 0; i--) {
    html += "<li class='copy'><p>name:" + attachments[i]['name'] + "</p><p>url:" + attachments[i]['url'] + "</p></li>";
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