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

        // Adjust root-style paths ("/path") so includes work when viewing files locally
        (async function adjustRootPaths(){
          var maxDepth = 6; // probe up to 6 levels
          var siteRootRel = '';
          var found = false;

          for(var i=0;i<=maxDepth;i++){
            try{
              var probe = siteRootRel + 'index.html';
              var res = await fetch(probe, { method: 'GET' });
              if(res && res.ok){ found = true; break; }
            }catch(e){ /* ignore probe failures */ }
            siteRootRel += '../';
          }

          if(!found){
            // fallback: use empty prefix (best effort)
            siteRootRel = '';
          }

          // Rewrite anchors, images, and form actions that start with '/'
          node.querySelectorAll('a[href]').forEach(function(a){
            var href = a.getAttribute('href');
            if(href && href.charAt(0) === '/'){
              a.setAttribute('href', siteRootRel + href.slice(1));
            }
          });

          node.querySelectorAll('img[src]').forEach(function(img){
            var src = img.getAttribute('src');
            if(src && src.charAt(0) === '/'){
              img.setAttribute('src', siteRootRel + src.slice(1));
            }
          });

          node.querySelectorAll('form[action]').forEach(function(form){
            var action = form.getAttribute('action');
            if(action && action.charAt(0) === '/'){
              form.setAttribute('action', siteRootRel + action.slice(1));
            }
          });
        })().then(function(){
          // Evaluate any scripts inside included html after paths adjusted
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