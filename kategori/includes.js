// Simple client-side include loader for kategori folder
(function(){
  function loadIncludes(){
    var nodes = document.querySelectorAll('[data-include-src]');
    nodes.forEach(function(node){
      var src = node.getAttribute('data-include-src');
      if(!src) return;
      fetch(src).then(function(res){
        if(!res.ok) throw new Error('Failed to load ' + src + ': ' + res.status);
        return res.text();
      }).then(function(html){
        node.innerHTML = html;
        // Evaluate any scripts inside included html
        var scripts = node.querySelectorAll('script');
        scripts.forEach(function(s){
          var newScript = document.createElement('script');
          if(s.src){
            newScript.src = s.src;
          } else {
            newScript.textContent = s.textContent;
          }
          document.body.appendChild(newScript);
          s.parentNode.removeChild(s);
        });
      }).catch(function(err){
        console.error(err);
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', loadIncludes);
  } else {
    loadIncludes();
  }
})();