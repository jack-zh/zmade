var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    navigator.saveBlob = navigator.saveBlob || navigator.msSaveBlob || navigator.mozSaveBlob || navigator.webkitSaveBlob;
    window.saveAs = window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs;

    // Because highlight.js is a bit awkward at times
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
      document.getElementById('out').innerHTML = marked(val);
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
      alert(code)
    }


    document.addEventListener('keydown', function(e){
      if(e.keyCode == 83 && (e.ctrlKey || e.metaKey)){
        e.preventDefault();
        save();
        return false;
      }
    })

    update(editor);
    editor.focus();

    var GoSquared = { acct: 'GSN-265185-D' };