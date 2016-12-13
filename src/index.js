/**
 * Deckbox card links extension
 * Usage:
 * M(Card Name) -> <a href="https://deckbox.org/mtg/Card Name">Card Name</a>
 * M[Display](Card Name) ->
 *		<a href="https://deckbox.org/mtg/Card Name">Display</a>
 */

(function () {
   // The standard encodeURIComponent doesn't escape single quotes.
   function fixedEncodeURIComponent (str) {
      return encodeURIComponent(str).replace(/[!'()*]/g, escape);
   }

   // Showdown extension function
   var deckbox_link = function () {
      return [
         {
            type:    'lang',
            regex:   '\\b(\\\\)?M(?:\\[([^\\]]+)])?\\(([^\\))]+)\\)',
            replace: function (match, leadingSlash, display, cardname) {
               // Check if we matched the leading \ and return nothing changed if so
               if (leadingSlash === '\\') {
                  return match;
               } else {
                  display = display || cardname;
                  var linkname =fixedEncodeURIComponent(cardname);
                  return '<a href="https://deckbox.org/mtg/' + linkname + '">' + display + '</a>';
               }
            }
         }
      ];
	};

   // Client-side export
   if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) {
      window.Showdown.extensions.deckbox = deckbox_link;
   }
   // Server-side export
   if (typeof module !== 'undefined') {
      module.exports = deckbox_link;
   }
}());
