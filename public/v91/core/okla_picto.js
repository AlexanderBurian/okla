/* OKLA – the pictograms, drawn as the header's own icons (the orders clipboard, the headset): solid shapes on a 24-unit
   grid in one colour (currentColor - navy where they are used), details cut out of them. Shared by the PC category
   column's helpful links (okla_cat_facets.js) and the phone menu (okla_mobile_menu.js).
   window.oklaPicto(name, className) -> '<svg ...>' or '' for an unknown name. */
(function(){
 'use strict';
 var P={
  "clipboard": "<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M9 2h6a1.5 1.5 0 0 1 1.5 1.5V4H18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1.5v-.5A1.5 1.5 0 0 1 9 2Zm.5 2v1.6h5V4ZM8.50 9.4h7.00a0.9 0.9 0 0 1 0 1.8H8.50a0.9 0.9 0 0 1 0-1.8ZM8.50 13h7.00a0.9 0.9 0 0 1 0 1.8H8.50a0.9 0.9 0 0 1 0-1.8ZM8.50 16.6h3.60a0.9 0.9 0 0 1 0 1.8H8.50a0.9 0.9 0 0 1 0-1.8Z\"/>",
  "truck": "<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M3.5 4.6h9.7A1.5 1.5 0 0 1 14.7 6.1v9.1H2V6.1a1.5 1.5 0 0 1 1.5-1.5ZM15.6 7.8h3.1a1.5 1.5 0 0 1 1.2.6l2.3 3.1a1.5 1.5 0 0 1 .3.9v1.3a1.5 1.5 0 0 1-1.5 1.5h-5.4ZM17.2 9.4v2.7h3.3l-1.9-2.7ZM6.6 15.7a2.5 2.5 0 1 0 0 5.0 2.5 2.5 0 0 0 0-5.0ZM6.6 17.3a0.9 0.9 0 1 0 0 1.8 0.9 0.9 0 0 0 0-1.8ZM17.8 15.7a2.5 2.5 0 1 0 0 5.0 2.5 2.5 0 0 0 0-5.0ZM17.8 17.3a0.9 0.9 0 1 0 0 1.8 0.9 0.9 0 0 0 0-1.8Z\"/>",
  "return": "<path d=\"M3.4 12.6A8.8 8.8 0 1 0 12.4 3.8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M12.5 .9v5.8L8.5 3.8ZM12.4 8.3l4.2 2.05-4.2 2.05-4.2-2.05ZM7.75 11.05l3.95 1.95v4.6l-3.95-2.05ZM13.1 13l3.95-1.95v4.5l-3.95 2.05Z\"/>",
  "shield": "<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M12 2.1l8.1 3v6.2c0 5-3.4 8.8-8.1 10.6C7.3 20.1 3.9 16.3 3.9 11.3V5.1ZM15.9 8.5l-5.1 5.1-2.6-2.6-1.4 1.4 4 4 6.5-6.5Z\"/>",
  "card": "<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M4.5 4.5h15A2.5 2.5 0 0 1 22 7v10a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17V7a2.5 2.5 0 0 1 2.5-2.5ZM2 8.2h20v2.6H2ZM5.80 14.6h3.80a0.9 0.9 0 0 1 0 1.8H5.80a0.9 0.9 0 0 1 0-1.8Z\"/>",
  "chat": "<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M12 3c5.2 0 9.4 3.6 9.4 8.2s-4.2 8.2-9.4 8.2c-1.3 0-2.5-.2-3.6-.6l-4.6 1.9 1.3-4.2C3.6 15 2.6 13.2 2.6 11.2 2.6 6.6 6.8 3 12 3ZM7.9 9.85a1.35 1.35 0 1 0 0 2.7 1.35 1.35 0 0 0 0-2.7ZM12 9.85a1.35 1.35 0 1 0 0 2.7 1.35 1.35 0 0 0 0-2.7ZM16.1 9.85a1.35 1.35 0 1 0 0 2.7 1.35 1.35 0 0 0 0-2.7Z\"/>",
  "tools": "<g transform=\"rotate(-45 12 12)\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M10.8 1.5h2.4l.45 3.1-.9 2.3h-1.5l-.9-2.3ZM11.25 6.7h1.5v2.9h-1.5ZM11.25 14.4h1.5v1.2h-1.5ZM12 15.2a2.6 2.6 0 0 1 2.6 2.6v2.6a2.6 2.6 0 0 1-5.2 0v-2.6a2.6 2.6 0 0 1 2.6-2.6Z\"/></g><g transform=\"rotate(45 12 12)\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M10.8 5.9V1.875A4.2 4.2 0 0 0 10.4 9.78V17.13A2.7 2.7 0 1 0 13.6 17.13V9.78A4.2 4.2 0 0 0 13.2 1.875V5.9A1.2 1.2 0 0 1 10.8 5.9ZM12 18.3a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z\"/></g>",
  "person": "<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M12 12.2a4.6 4.6 0 1 0 0-9.2 4.6 4.6 0 0 0 0 9.2Zm0 1.9c-4.6 0-8.2 2.4-8.2 5.6v.5c0 .66.54 1.2 1.2 1.2h14c.66 0 1.2-.54 1.2-1.2v-.5c0-3.2-3.6-5.6-8.2-5.6Z\"/>",
  "star": "<path fill=\"currentColor\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linejoin=\"round\" d=\"M12.00 2.90L14.53 9.42L21.51 9.81L16.09 14.23L17.88 20.99L12.00 17.20L6.12 20.99L7.91 14.23L2.49 9.81L9.47 9.42Z\"/>"
};
 window.OKLA_PICTO=P;
 window.oklaPicto=function(n,cls){return P[n]?'<svg class="okla-picto '+(cls||'')+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+P[n]+'</svg>':''};
})();
