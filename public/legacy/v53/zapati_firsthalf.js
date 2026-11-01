/* OKLA / zapati_firsthalf.js / verze 53 / nav, bannery, karty, nekonecne slidery */
(function(){
  'use strict';
  var css=String.raw`@media(min-width:992px){#navigation .navigation-in>ul.menu-level-1{display:none!important}}
/* OKLA V19 category styling */
#content-wrapper aside.sidebar.sidebar-left{background:#f3f4f6!important;border-right:1px solid #d9dee7!important;box-sizing:border-box!important}
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner{background:#f3f4f6!important;min-height:100%!important}
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box.box-categories{background:#fff!important;padding-bottom:16px!important;box-shadow:none!important}
#content-wrapper aside.sidebar.sidebar-left .box-categories .pageElement__heading{background:#fff!important}
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box:not(.box-categories){background:#f3f4f6!important}
#content-wrapper aside.sidebar.sidebar-left #categories .topic>a.okla-category-with-icon{display:flex!important;align-items:center!important;gap:10px!important;margin-left:14px!important;width:calc(100% - 14px)!important;padding:8px 4px 8px 0!important;min-height:43px!important;box-sizing:border-box!important;font-size:14px!important;line-height:1.4!important;font-weight:400!important;text-decoration:none!important}
#content-wrapper aside.sidebar.sidebar-left #categories .topic>a.okla-category-with-icon:hover{background:rgba(17,76,140,.045)!important;text-decoration:none!important}
#content-wrapper aside.sidebar.sidebar-left #categories .topic>a.okla-category-with-icon::before{display:none!important;content:none!important}
#content-wrapper aside.sidebar.sidebar-left #categories .topic>a .okla-cat-svg{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 21px!important;min-width:21px!important;width:21px!important;height:21px!important;color:#19508e!important;line-height:0!important}
#content-wrapper aside.sidebar.sidebar-left #categories .topic>a .okla-cat-svg svg{display:block!important;width:20px!important;height:20px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.7!important;stroke-linecap:round!important;stroke-linejoin:round!important;overflow:visible!important}
#content-wrapper aside.sidebar.sidebar-left #categories .topic>a .okla-cat-label{flex:1 1 auto!important;line-height:1.4!important}
@media(max-width:991px){#content-wrapper aside.sidebar.sidebar-left #categories .topic>a.okla-category-with-icon{margin-left:9px!important;width:calc(100% - 9px)!important}}
body.type-index #content-wrapper main#content{background:linear-gradient(180deg,#f5faff 0px,#fbfdff 140px,#fff 320px) 0 0/100% 320px no-repeat #fff!important}
@media(min-width:992px){html{background:#c2e8ff!important}body{background:linear-gradient(180deg,#fff 0%,#fefeff 18%,#f8fcff 32%,#eaf7ff 52%,#d5efff 76%,#c2e8ff 100%) 0 0/100% 950px no-repeat #c2e8ff!important;background-attachment:scroll!important}body::before{display:none!important}}
@media(min-width:992px){#content-wrapper{position:relative!important;border-top:6px solid #19477E!important;border-radius:6px 6px 6px 6px!important;overflow:hidden!important;background:#fff!important;box-sizing:border-box!important;box-shadow:0 0 10px #0019411c!important}#content-wrapper::before{display:none!important}}
@media(min-width:768px){#content .banners-row{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:14px!important;width:100%!important;max-width:100%!important;height:auto!important;margin:0 0 24px!important;padding:0!important;align-items:start!important}#content .banners-row>.col-sm-8,#content .banners-row>.col-sm-4{display:block!important;float:none!important;flex:none!important;flex-basis:auto!important;width:100%!important;max-width:100%!important;min-width:0!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important}#content .banners-row #carousel{display:block!important;position:relative!important;width:100%!important;max-width:100%!important;height:auto!important;aspect-ratio:4.2/1!important;margin:0!important;border-radius:8px!important;overflow:hidden!important}#content .banners-row #carousel .carousel-inner{width:100%!important;height:100%!important}#content .banners-row #carousel .carousel-inner>.item:not(.active){display:none!important}#content .banners-row #carousel .carousel-inner>.item.active{display:block!important;position:relative!important;left:0!important;transform:none!important;width:100%!important;height:100%!important}#content .banners-row #carousel .item>a{display:block!important;width:100%!important;height:100%!important}#content .banners-row #carousel .item img{display:block!important;width:100%!important;max-width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important}#content .banners-row #carousel .carousel-indicators,#content .banners-row #carousel .carousel-control{display:none!important}#content .next-to-carousel-banners{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px!important;width:100%!important;max-width:100%!important;height:auto!important;margin:0!important;padding:0!important}#content .next-to-carousel-banners>.banner-wrapper{display:block!important;position:relative!important;float:none!important;flex:none!important;width:100%!important;max-width:100%!important;height:auto!important;aspect-ratio:1.78/1!important;margin:0!important;padding:0!important;border-radius:8px!important;overflow:hidden!important}#content .next-to-carousel-banners>.banner-wrapper>a{display:block!important;width:100%!important;height:100%!important}#content .next-to-carousel-banners img{display:block!important;width:100%!important;max-width:100%!important;height:100%!important;object-fit:cover!important}}@media(max-width:767px){#content .banners-row>.col-sm-4,#content .next-to-carousel-banners{display:none!important}#content .banners-row>.col-sm-8{display:block!important;float:none!important;width:100%!important;max-width:100%!important;padding:0!important}#content .banners-row #carousel{width:100%!important;height:auto!important;aspect-ratio:auto!important}#content .banners-row #carousel img{display:block!important;width:100%!important;height:auto!important;aspect-ratio:auto!important;object-fit:contain!important}}
@media(min-width:992px){body.type-index #content-wrapper{margin-top:-30px!important}body:not(.type-index) #content-wrapper{margin-top:0!important}}
/* OKLA v11 / jednotna typografie v cele sablone */
body,body button,body input,body select,body textarea,#header,#navigation,#content-wrapper,#content,.sidebar,.footer,#footer{font-family:'Roboto','Segoe UI',Arial,sans-serif!important}
/* OKLA v11 / homepage slider and Alza-inspired card system */
#content .homepage-group-title.okla-slider-heading{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:16px!important;clear:both!important;margin:30px 0 18px!important;font-size:24px!important;font-weight:700!important;letter-spacing:-.35px!important;color:#132c4a!important}
#content .okla-slider-shell{position:relative!important;display:block!important;width:100%!important;max-width:100%!important;margin:0 0 32px!important;padding:0!important;overflow:visible!important;box-sizing:border-box!important}#content .okla-slider-viewport{position:relative!important;width:100%!important;max-width:100%!important;margin:0!important;padding:9px 7px 14px!important;box-sizing:border-box!important;overflow:hidden!important;touch-action:pan-y!important;contain:layout style!important;border-radius:10px!important}
#content .okla-slider-shell>.okla-slider-controls{position:absolute!important;z-index:30!important;top:0!important;right:-20px!important;bottom:0!important;left:-20px!important;width:auto!important;height:auto!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:0!important;padding:0!important;margin:0!important;pointer-events:none!important;box-sizing:border-box!important}
#content .okla-slider-controls button{display:inline-grid!important;place-items:center!important;flex:0 0 38px!important;width:38px!important;min-width:38px!important;height:74px!important;min-height:74px!important;padding:0!important;margin:0!important;border:0!important;border-radius:0!important;background:#123d84!important;color:#fff!important;cursor:pointer!important;pointer-events:auto!important;box-shadow:0 1px 6px #152c4a24!important;transition:background-color .18s ease,opacity .18s ease!important}
#content .okla-slider-controls button:hover{background:#0a2b68!important;color:#fff!important}#content .okla-slider-controls button:focus-visible{outline:3px solid #ffba13!important;outline-offset:-3px!important}#content .okla-slider-controls button svg{display:block!important;width:22px!important;height:22px!important;stroke:currentColor!important;fill:none!important;stroke-width:2.5!important;stroke-linecap:round!important;stroke-linejoin:round!important}
#content .okla-slider-controls .okla-slider-next{border-radius:6px 0 0 6px!important}
#content .okla-slider-controls .okla-slider-prev{opacity:1!important;border-radius:0 6px 6px 0!important}
#content .products.products-block.okla-slider-track{display:flex!important;flex-wrap:nowrap!important;gap:16px!important;align-items:stretch!important;width:100%!important;min-width:0!important;margin:0!important;padding:0!important;transform:translate3d(0,0,0);will-change:transform!important}
#content .products.products-block.okla-slider-track>.product{flex:0 0 var(--okla-card-width,calc((100% - 64px)/5))!important;width:var(--okla-card-width,calc((100% - 64px)/5))!important;min-width:0!important;max-width:none!important;float:none!important;clear:none!important;margin:0!important;padding:0!important;border:0!important;background:#fff!important;box-shadow:none!important;box-sizing:border-box!important;position:relative!important}
#content .okla-slider-track>.product:before,#content .okla-slider-track>.product:after{content:none!important;display:none!important}
#content .okla-slider-track>.product .p{display:flex!important;flex-direction:column!important;align-items:stretch!important;position:relative!important;width:100%!important;height:100%!important;min-width:0!important;margin:0!important;padding:14px 12px 20px!important;border:1px solid transparent!important;border-radius:9px!important;box-sizing:border-box!important;background:#fff!important;box-shadow:0 2px 12px transparent!important;text-align:center!important;transition:box-shadow .2s ease!important;transform:none!important;z-index:0!important}
/* Alza-inspired hover - only shadow, never translation. */
@media(hover:hover) and (pointer:fine){#content .okla-slider-track>.product:hover{z-index:3!important}#content .okla-slider-track>.product .p:hover{z-index:3!important;box-shadow:0 2px 12px rgba(0,0,0,.20)!important;transform:none!important}}
#content .okla-slider-track>.product .p:focus-within{z-index:3!important;border-color:#b8cbe4!important;box-shadow:0 1px 9px rgba(0,0,0,.13)!important}
@media(prefers-reduced-motion:reduce){#content .okla-slider-track>.product .p{transition:none!important}}
#content .okla-slider-track>.product .p>a.image{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;max-height:225px!important;height:clamp(145px,17vw,225px)!important;min-height:145px!important;margin:0 auto 11px!important;padding:0!important;overflow:hidden!important;background:#fff!important;aspect-ratio:auto!important}
#content .okla-slider-track>.product .p>a.image img{display:block!important;width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;margin:0!important;padding:0!important;object-fit:contain!important;object-position:center!important}
#content .okla-slider-track .p-in{display:flex!important;flex:1!important;flex-direction:column!important;width:100%!important;min-width:0!important;margin:0!important;padding:0!important}
#content .okla-slider-track .p-in-in{display:flex!important;flex:1!important;flex-direction:column!important;align-items:center!important;width:100%!important;min-width:0!important;margin:0!important;padding:0!important}
#content .okla-slider-track .ratings-wrapper.okla-ratings{display:flex!important;align-items:center!important;justify-content:center!important;flex-direction:row!important;gap:5px!important;flex:none!important;width:100%!important;min-height:24px!important;margin:0 0 10px!important;padding:0!important;line-height:18px!important}
#content .okla-slider-track .okla-empty-stars{display:inline-flex!important;align-items:center!important;gap:2px!important;color:#ffba00!important;white-space:nowrap!important}
#content .okla-slider-track .okla-empty-stars svg{display:block;width:17px;height:17px;stroke:#ffba00;fill:#ffba00;stroke-width:1;stroke-linecap:round;stroke-linejoin:round}
#content .okla-slider-track .okla-rating-caption{display:inline-block!important;color:#738294!important;font-size:11px!important;line-height:16px!important;white-space:nowrap!important}
#content .okla-slider-track .okla-ratings .stars-placeholder{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;min-height:17px!important}
#content .okla-slider-track .okla-ratings .stars{display:inline-block!important;min-height:16px!important}
#content .okla-slider-track a.name{display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;overflow:hidden!important;width:100%!important;height:52px!important;min-height:52px!important;max-height:52px!important;margin:0 0 6px!important;padding:0!important;color:#16438c!important;font-family:inherit!important;font-size:16px!important;font-weight:600!important;line-height:24px!important;text-align:center!important;text-decoration:none!important;word-break:normal!important}
#content .okla-slider-track a.name:hover{color:#0b336c!important;text-decoration:underline!important}
#content .okla-slider-track .availability{display:block!important;flex:none!important;width:100%!important;min-height:21px!important;margin:0 0 5px!important;padding:0!important;color:#d72828!important;font-size:12px!important;line-height:18px!important;text-align:center!important}
#content .okla-slider-track .p-bottom{display:block!important;width:100%!important;flex:none!important;margin-top:auto!important;padding:0!important}
#content .okla-slider-track .p-bottom>div{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-end!important;width:100%!important;gap:0!important}
#content .okla-slider-track .prices{display:flex!important;flex-direction:column!important;justify-content:flex-start!important;align-items:center!important;width:157px!important;max-width:100%!important;min-height:76px!important;height:76px!important;margin:12px auto 0!important;padding:0!important;border:0!important;border-radius:5px!important;background:#eaf3fc!important;box-sizing:border-box!important;box-shadow:none!important;overflow:hidden!important}
#content .okla-slider-track .prices:before{content:'NOVINKA'!important;display:flex!important;align-items:center!important;justify-content:center!important;flex:0 0 25px!important;width:100%!important;height:25px!important;background:#062b60!important;color:#fff!important;font-size:11px!important;font-weight:800!important;letter-spacing:.2px!important;line-height:25px!important}
#content .okla-slider-track .price,#content .okla-slider-track .price-final{display:flex!important;align-items:center!important;justify-content:center!important;flex:1!important;width:100%!important;min-height:0!important;height:auto!important;padding:0 4px!important;margin:0!important;border:0!important;background:none!important;text-align:center!important;box-sizing:border-box!important}
#content .okla-slider-track .price-final strong{display:block!important;width:100%!important;color:#073571!important;font-size:23px!important;font-weight:800!important;line-height:32px!important;white-space:nowrap!important;text-align:center!important}
#content .okla-slider-track .p-tools{display:flex!important;justify-content:center!important;align-items:center!important;width:100%!important;margin:21px 0 0!important;padding:0!important;float:none!important;background:none!important}
#content .okla-slider-track .p-tools form{display:flex!important;justify-content:center!important;align-items:center!important;width:100%!important;margin:0!important;padding:0!important;float:none!important}
#content .okla-slider-track .p-tools .btn-cart{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;width:157px!important;max-width:100%!important;height:42px!important;min-height:42px!important;margin:0!important;padding:0 8px 0 27px!important;border:1px solid #cbdcf5!important;border-radius:8px!important;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2316438c'%3E%3Cpath d='M2 2h2.5l2 11.4a2 2 0 0 0 2 1.6h10a2 2 0 0 0 2-1.6L22 6H6.2l-.4-2H2V2zm7 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm9 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'/%3E%3C/svg%3E") no-repeat 13px center/20px 20px!important;box-sizing:border-box!important;color:#16438c!important;font-size:14px!important;font-weight:600!important;line-height:21px!important;text-decoration:none!important;text-transform:none!important;white-space:nowrap!important;box-shadow:none!important;text-shadow:none!important;cursor:pointer!important}
#content .okla-slider-track .p-tools .btn-cart:before,#content .okla-slider-track .p-tools .btn-cart:after,#content .okla-slider-track .p-tools .btn-cart span:before,#content .okla-slider-track .p-tools .btn-cart span:after{content:none!important;display:none!important}
#content .okla-slider-track .p-tools .btn-cart span{display:inline!important;position:static!important;margin:0!important;padding:0!important;color:inherit!important;font:inherit!important;line-height:inherit!important}
#content .okla-slider-track .p-tools .btn-cart:hover{background-color:#f1f7ff!important;border-color:#8eb8e6!important;color:#16438c!important}
#content .okla-slider-track .p-desc,#content .okla-slider-track .p-code{display:none!important}
#content .benefitBanner.position--benefitHomepage{width:100%!important;margin:32px 0 24px!important;clear:both!important}
@media(max-width:1199px){#content .products.products-block.okla-slider-track{gap:12px!important}#content .okla-slider-track>.product .p{padding:11px 8px 16px!important}#content .okla-slider-track a.name{font-size:15px!important}}
@media(max-width:767px){#content .products.products-block.okla-slider-track{gap:10px!important}#content .homepage-group-title.okla-slider-heading{font-size:19px!important}#content .okla-slider-shell>.okla-slider-controls{top:0!important;right:-8px!important;bottom:0!important;left:-8px!important;height:auto!important;align-items:center!important}#content .okla-slider-controls button{width:30px!important;min-width:30px!important;flex-basis:30px!important;height:56px!important;min-height:56px!important}#content .okla-slider-track>.product .p{padding:9px 6px 13px!important}#content .okla-slider-track>.product .p>a.image{height:140px!important;min-height:120px!important}#content .okla-slider-track a.name{font-size:13px!important;line-height:20px!important;height:43px!important;min-height:43px!important;max-height:43px!important}#content .okla-slider-track .prices{width:128px!important;height:69px!important;min-height:69px!important}#content .okla-slider-track .price-final strong{font-size:18px!important}#content .okla-slider-track .p-tools .btn-cart{width:128px!important;font-size:12px!important}#content .okla-slider-track .okla-rating-caption{font-size:9px!important}}
@media(prefers-reduced-motion:reduce){#content .okla-slider-track{transition:none!important}}
/* V13: ovladani navazane na samotny produktovy slider, nikoli na main: zadny posun pri nacteni banneru / lazy images. */
#content .okla-slider-shell{position:relative!important;isolation:isolate!important;overflow:visible!important}
#content .okla-slider-shell>.okla-slider-controls{position:absolute!important;display:flex!important;z-index:80!important;top:0!important;bottom:0!important;left:-20px!important;right:-20px!important;width:auto!important;max-width:none!important;height:auto!important;min-height:0!important;align-items:center!important;justify-content:space-between!important;gap:0!important;margin:0!important;padding:0!important;overflow:visible!important;transform:none!important;float:none!important;pointer-events:none!important;box-sizing:border-box!important}
#content .okla-slider-shell>.okla-slider-controls>button{position:relative!important;top:auto!important;bottom:auto!important;left:auto!important;right:auto!important;display:grid!important;place-items:center!important;flex:0 0 38px!important;width:38px!important;min-width:38px!important;max-width:38px!important;height:74px!important;min-height:74px!important;max-height:74px!important;margin:0!important;padding:0!important;transform:none!important;float:none!important;border:0!important;box-sizing:border-box!important;opacity:1!important;visibility:visible!important;background:#123d84!important;color:#fff!important;pointer-events:auto!important;cursor:pointer!important}
#content .okla-slider-shell>.okla-slider-controls>.okla-slider-prev{border-radius:0 6px 6px 0!important}
#content .okla-slider-shell>.okla-slider-controls>.okla-slider-next{border-radius:6px 0 0 6px!important}
#content .okla-slider-shell>.okla-slider-controls>button svg{display:block!important;width:22px!important;height:22px!important;fill:none!important;stroke:#fff!important;stroke-width:2.5!important}
#content .okla-slider-shell>.okla-slider-controls>button:hover{background:#092c67!important}
/* Mobil: slider pouze tahem prstu; bez sipek, kazda karta ma trvaly viditelny stin. */
@media(max-width:767px){#content .okla-slider-shell>.okla-slider-controls{display:none!important}#content .okla-slider-viewport{padding:13px 9px 19px!important}#content .okla-slider-track>.product .p{border:1px solid #e1e5ec!important;border-radius:9px!important;box-shadow:0 2px 11px rgba(30,43,63,.18)!important;transform:none!important;transition:none!important}#content .okla-slider-track>.product .p:focus-within{box-shadow:0 2px 11px rgba(30,43,63,.18)!important}#content .okla-slider-track .ratings-wrapper.okla-ratings{min-height:38px!important;flex-direction:column!important;gap:2px!important;margin-bottom:7px!important}#content .okla-slider-track .okla-ratings .stars-placeholder{flex-direction:column!important;gap:2px!important}#content .okla-slider-track .okla-empty-stars{gap:1px!important}#content .okla-slider-track .okla-empty-stars svg{width:14px!important;height:14px!important}#content .okla-slider-track .okla-rating-caption{font-size:10px!important;line-height:13px!important}}
/* V14 — Global desktop width identical across homepage, product details, categories and information pages. */
:root{--okla-site-width:1258px;--okla-site-gutter:40px}
@media(min-width:992px){body .overall-wrapper>.container,body .overall-wrapper>#header>.container.navigation-wrapper,body .overall-wrapper>.top-navigation-bar>.container,body #footer>.container{width:calc(100% - 80px)!important;max-width:var(--okla-site-width)!important;margin-left:auto!important;margin-right:auto!important;box-sizing:border-box!important}body .overall-wrapper>#content-wrapper.container{width:calc(100% - 80px)!important;max-width:var(--okla-site-width)!important;min-width:0!important;margin-left:auto!important;margin-right:auto!important;box-sizing:border-box!important}}
@media(min-width:768px) and (max-width:991px){body .overall-wrapper>.container,body .overall-wrapper>#header>.container.navigation-wrapper,body .overall-wrapper>.top-navigation-bar>.container{width:calc(100% - 36px)!important;max-width:none!important;margin-left:auto!important;margin-right:auto!important;box-sizing:border-box!important}}
/* V14 — header aligned like Alza: logo | centered wide search | cart. No structure changes on mobile. */
@media(min-width:992px){body #header .header-top{display:grid!important;grid-template-columns:minmax(190px,1fr) minmax(320px,620px) minmax(155px,1fr)!important;gap:clamp(16px,2vw,35px)!important;align-items:center!important;min-height:90px!important;padding:12px 0!important;box-sizing:border-box!important}body #header .header-top>.site-name-wrapper{grid-column:1!important;justify-self:start!important;align-self:center!important;float:none!important;width:100%!important;max-width:255px!important;margin:0!important;padding:0!important}body #header .site-name-wrapper .site-name{float:none!important;width:auto!important;max-width:100%!important;margin:0!important}body #header .site-name-wrapper .site-name img{max-width:230px!important;max-height:75px!important;width:auto!important;height:auto!important;object-fit:contain!important}body #header .header-top>.search{position:relative!important;top:auto!important;right:auto!important;bottom:auto!important;left:auto!important;transform:none!important;grid-column:2!important;justify-self:center!important;align-self:center!important;float:none!important;display:block!important;width:100%!important;min-width:0!important;max-width:620px!important;margin:0!important;padding:0!important}body #header .header-top>.navigation-buttons{position:relative!important;top:auto!important;right:auto!important;bottom:auto!important;left:auto!important;transform:none!important;grid-column:3!important;justify-self:end!important;align-self:center!important;float:none!important;display:flex!important;justify-content:flex-end!important;align-items:center!important;width:auto!important;max-width:100%!important;min-width:0!important;margin:0!important;padding:0!important}}
/* Desktop / tablet search; focus ring belongs to the full editable search box. */
@media(min-width:768px){body #header .search{min-width:0!important}body #header .search form.search-form{display:block!important;width:100%!important;max-width:100%!important;height:auto!important;min-width:0!important;margin:0!important;padding:0!important;float:none!important}body #header .search form.search-form fieldset{display:flex!important;position:relative!important;align-items:center!important;gap:4px!important;width:100%!important;min-width:0!important;height:54px!important;min-height:54px!important;margin:0!important;padding:4px!important;border:1px solid #cbdff1!important;border-radius:12px!important;background:#fff!important;box-shadow:0 0 0 3px #eaf4fc!important;box-sizing:border-box!important;overflow:visible!important;float:none!important;transition:border-color .16s ease,box-shadow .16s ease!important}body #header .search form.search-form fieldset:before{content:''!important;position:absolute!important;left:17px!important;top:50%!important;transform:translateY(-50%)!important;width:19px!important;height:19px!important;pointer-events:none!important;z-index:2!important;background:transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23154783' stroke-width='2.3' stroke-linecap='round'%3E%3Ccircle cx='10.7' cy='10.7' r='6.6'/%3E%3Cpath d='m15.7 15.7 5 5'/%3E%3C/svg%3E") center/contain no-repeat!important}body #header .search form.search-form fieldset:focus-within{border-color:#1685d7!important;box-shadow:0 0 0 3px rgba(25,143,218,.18)!important;outline:0!important}body #header .search form.search-form .query-input{display:block!important;position:relative!important;top:auto!important;right:auto!important;bottom:auto!important;left:auto!important;float:none!important;flex:1 1 auto!important;width:0!important;min-width:0!important;max-width:none!important;height:44px!important;min-height:44px!important;margin:0!important;padding:0 10px 0 44px!important;border:0!important;border-radius:8px!important;background:transparent!important;color:#163955!important;font:400 14px/1.3 'Roboto','Segoe UI',Arial,sans-serif!important;box-shadow:none!important;outline:0!important;box-sizing:border-box!important;appearance:none!important;-webkit-appearance:none!important}body #header .search form.search-form .query-input:focus,body #header .search form.search-form .query-input:focus-visible{outline:0!important;border:0!important;box-shadow:none!important}body #header .search form.search-form .query-input::placeholder{color:#8b9caf!important;opacity:1!important}body #header .search form.search-form button[type=submit]{display:inline-flex!important;position:relative!important;top:auto!important;right:auto!important;bottom:auto!important;left:auto!important;flex:0 0 91px!important;align-items:center!important;justify-content:center!important;width:91px!important;min-width:91px!important;max-width:91px!important;height:44px!important;min-height:44px!important;margin:0!important;padding:0 12px!important;border:0!important;border-radius:8px!important;background:#008ddd!important;color:#fff!important;box-shadow:none!important;text-shadow:none!important;font:700 14px/1 'Roboto','Segoe UI',Arial,sans-serif!important;text-transform:none!important;cursor:pointer!important;transition:background-color .15s ease!important}body #header .search form.search-form button[type=submit]:hover{background:#067bc5!important}body #header .search form.search-form button[type=submit]:focus-visible{outline:3px solid #124c9b!important;outline-offset:2px!important}body #header .search .search-whisperer{z-index:200!important}body #header .search form.search-form fieldset .search-whisperer{flex:0 0 0!important;width:0!important;min-width:0!important;max-width:0!important;margin:0!important;padding:0!important}body #header .search form.search-form fieldset .search-whisperer:not(:empty){width:auto!important;max-width:none!important;flex:none!important}}
/* V14 — 768–991 Shoptet uses different header layout; preserve its structure. */
@media(min-width:768px) and (max-width:991px){body #header .search form.search-form fieldset{height:50px!important;min-height:50px!important}body #header .search form.search-form button[type=submit]{height:40px!important;min-height:40px!important}}
/* V14 — a very subtle cool blue top for mobile; other mobile elements stay native. */
@media(max-width:767px){body #header{background:linear-gradient(180deg,#edf8ff 0%,#f6fbff 48%,#fff 100%)!important}body #header>.container.navigation-wrapper,body #header .header-top{background:transparent!important}body .top-navigation-bar{background:#f5fbff!important}body #header:before{background:transparent!important}}
/* OKLA V20: full-width white category surface covering Shoptet sidebar gutters; grey content below remains grey. */
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box.box-categories{background-color:#fff!important;box-shadow:-22px 0 0 0 #fff,22px 0 0 0 #fff!important;border-radius:0!important}
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box.box-categories #categories,#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box.box-categories .pageElement__heading{background-color:#fff!important}
#content-wrapper aside.sidebar.sidebar-left{border-right:1px solid #d4dce6!important}
/* V21: use a full-width white surface rather than side box-shadows (which miss the top gutter). */
#content-wrapper aside.sidebar.sidebar-left{position:relative!important;background:#f3f4f6!important;border-right:1px solid #d4dce6!important;box-sizing:border-box!important}
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner{position:relative!important;z-index:1!important;background:transparent!important;min-height:100%!important}
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box.box-categories{background:transparent!important;box-shadow:none!important}
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box.box-categories #categories,#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box.box-categories .pageElement__heading{background:transparent!important}
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box:not(.box-categories){background:#f3f4f6!important}
#okla-sidebar-top-white{position:absolute!important;top:0!important;left:0!important;right:0!important;background:#fff!important;z-index:0!important;pointer-events:none!important}
#okla-sidebar-horizontal{position:absolute!important;left:0!important;right:0!important;height:1px!important;background:#d4dce6!important;z-index:3!important;pointer-events:none!important}
#content-wrapper>#okla-sidebar-vertical{position:absolute!important;top:0!important;bottom:0!important;width:1px!important;background:#d4dce6!important;z-index:7!important;pointer-events:none!important}
#content-wrapper>#okla-sidebar-vertical{display:none!important}
/* OKLA V22: one full-width separator only, original Shoptet borders removed. */
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box.box-categories{border:0!important;border-bottom:0!important;margin-bottom:0!important;padding-bottom:0!important;box-shadow:none!important}
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box.box-categories #categories,
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box.box-categories #categories .categories,
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box.box-categories .skip-link__wrapper{border-bottom:0!important;box-shadow:none!important}
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box.box-onlinePayments{border-top:0!important;margin-top:0!important;box-shadow:none!important}
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box.box-categories::after,
#content-wrapper aside.sidebar.sidebar-left .sidebar-inner>.box.box-categories #categories::after{border:0!important;box-shadow:none!important;background:none!important}
#content-wrapper aside.sidebar.sidebar-left #categories .topic>a.okla-category-with-icon{position:relative!important;border-radius:2px!important;background:transparent!important;box-shadow:none!important;isolation:isolate!important;transition:background-color .16s ease,color .16s ease!important}
#content-wrapper aside.sidebar.sidebar-left #categories .topic>a.okla-category-with-icon::before{display:block!important;content:""!important;position:absolute!important;left:calc(-1 * var(--okla-hover-overhang,14px))!important;top:0!important;bottom:0!important;width:3px!important;border-radius:0!important;background:transparent!important;pointer-events:none!important}
@media(hover:hover) and (pointer:fine){
#content-wrapper aside.sidebar.sidebar-left #categories .topic>a.okla-category-with-icon:hover{background:#f1f5fa!important;color:#164780!important;box-shadow:-45px 0 0 #f1f5fa!important;text-decoration:none!important}
#content-wrapper aside.sidebar.sidebar-left #categories .topic>a.okla-category-with-icon:hover::before{background:#164780!important}
#content-wrapper aside.sidebar.sidebar-left #categories .topic>a.okla-category-with-icon:hover .okla-cat-svg{color:#164780!important}
}
#content-wrapper aside.sidebar.sidebar-left #categories .topic>a.okla-category-with-icon:focus-visible{outline:2px solid #164780!important;outline-offset:2px!important}
/* OKLA V23 – five visible desktop product cards with balanced Alza-style proportions. */
@media(min-width:992px){
#content .products.products-block.okla-slider-track{gap:14px!important}
#content .okla-slider-track>.product .p{padding:11px 9px 16px!important}
#content .okla-slider-track>.product .p>a.image{height:clamp(142px,13.4vw,184px)!important;min-height:142px!important;max-height:184px!important;margin-bottom:9px!important}
#content .okla-slider-track a.name{font-size:14px!important;font-weight:600!important;line-height:21px!important;height:46px!important;min-height:46px!important;max-height:46px!important;margin-bottom:5px!important}
#content .okla-slider-track .ratings-wrapper.okla-ratings{min-height:22px!important;margin-bottom:8px!important}
#content .okla-slider-track .availability{font-size:11px!important;line-height:17px!important}
#content .okla-slider-track .prices{width:139px!important;max-width:100%!important;height:67px!important;min-height:67px!important;margin-top:9px!important}
#content .okla-slider-track .prices:before{height:22px!important;flex-basis:22px!important;font-size:10px!important;line-height:22px!important}
#content .okla-slider-track .price-final strong{font-size:20px!important;line-height:29px!important}
#content .okla-slider-track .p-tools{margin-top:15px!important}
#content .okla-slider-track .p-tools .btn-cart{width:139px!important;max-width:100%!important;height:37px!important;min-height:37px!important;font-size:12px!important;padding-left:24px!important;background-size:17px 17px!important;background-position:10px center!important}
#content .okla-slider-shell>.okla-slider-controls>button{flex:0 0 32px!important;width:32px!important;min-width:32px!important;max-width:32px!important;height:59px!important;min-height:59px!important;max-height:59px!important}
#content .okla-slider-shell>.okla-slider-controls>button svg{width:19px!important;height:19px!important}
}
@media(min-width:992px) and (max-width:1199px){
#content .okla-slider-track>.product .p{padding:9px 5px 14px!important}
#content .okla-slider-track>.product .p>a.image{height:144px!important;min-height:125px!important}
#content .okla-slider-track a.name{font-size:12px!important;line-height:18px!important;height:40px!important;min-height:40px!important;max-height:40px!important}
#content .okla-slider-track .prices,#content .okla-slider-track .p-tools .btn-cart{width:114px!important}
#content .okla-slider-track .price-final strong{font-size:17px!important}
#content .okla-slider-track .p-tools .btn-cart{font-size:11px!important}
}
/* Reduce homepage hero height without impacting functioning mobile carousel. */
@media(min-width:768px){
#content .banners-row #carousel{aspect-ratio:4.8/1!important}
#content .next-to-carousel-banners>.banner-wrapper{aspect-ratio:2.08/1!important}
#content .banners-row{gap:12px!important;margin-bottom:21px!important}
#content .next-to-carousel-banners{gap:12px!important}
}
/* Almost imperceptible cool-blue highlight, fading to white quickly. */
body.type-index #content-wrapper main#content{background:linear-gradient(180deg,#fbfdff 0px,#fdfefe 110px,#fff 240px) 0 0/100% 240px no-repeat #fff!important}
/* OKLA V24 – enlarge actual product images without moving cards; shorten desktop banners further. */
@media(min-width:992px){
#content .okla-slider-track>.product .p>a.image{height:clamp(182px,15.5vw,216px)!important;min-height:182px!important;max-height:216px!important;margin-bottom:6px!important}
#content .okla-slider-track>.product .p>a.image img{transform:scale(1.13)!important;transform-origin:center center!important;will-change:auto!important}
#content .okla-slider-track>.product .p{padding-top:7px!important}
}
@media(min-width:992px) and (max-width:1199px){
#content .okla-slider-track>.product .p>a.image{height:177px!important;min-height:170px!important;max-height:177px!important}
#content .okla-slider-track>.product .p>a.image img{transform:scale(1.10)!important}
}
@media(min-width:768px){
#content .banners-row #carousel{aspect-ratio:4.85/1!important}
#content .next-to-carousel-banners>.banner-wrapper{aspect-ratio:2.4/1!important}
#content .banners-row{gap:10px!important;margin-bottom:15px!important}
#content .next-to-carousel-banners{gap:10px!important}
}
/* OKLA V26: No top utility strip, functional compact Alza-like header actions. */
body .top-navigation-bar{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;max-height:0!important;margin:0!important;padding:0!important;border:0!important;overflow:hidden!important}
body #header{border-top:0!important}
@media(min-width:992px){
body #header .header-top{grid-template-columns:minmax(174px,1fr) minmax(300px,620px) minmax(280px,1.15fr)!important;gap:clamp(12px,1.75vw,29px)!important;min-height:83px!important;padding:9px 0!important}
body #header .header-top>.navigation-buttons.okla-header-ready{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:clamp(8px,1.2vw,18px)!important;max-width:100%!important}
body #header .navigation-buttons .okla-header-account{display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;min-width:0!important;max-width:145px!important;height:52px!important;position:static!important;margin:0!important;padding:3px 2px!important;border:0!important;background:transparent!important;color:#123967!important;box-shadow:none!important;text-shadow:none!important;font-family:'Roboto',Arial,sans-serif!important;text-align:left!important;white-space:nowrap!important;cursor:pointer!important;float:none!important}
body #header .navigation-buttons .okla-header-account::before,body #header .navigation-buttons .okla-header-account::after{content:none!important;display:none!important}
body #header .navigation-buttons .okla-header-account .okla-header-icon{flex:0 0 33px!important;width:33px!important;height:33px!important;border-radius:50%!important;background:#eef3f8!important;display:grid!important;place-items:center!important;color:#113c73!important}
body #header .navigation-buttons .okla-header-account .okla-header-icon svg{width:19px!important;height:19px!important;stroke:currentColor!important;fill:none!important;stroke-width:1.9!important;stroke-linecap:round!important;stroke-linejoin:round!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:3px!important;min-width:0!important;line-height:1.1!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy strong{color:#092e5d!important;font-size:13px!important;font-weight:700!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy small{color:#1a5b94!important;font-size:11px!important;font-weight:400!important}
body #header .navigation-buttons .okla-header-support{display:flex!important;flex:0 0 auto!important;align-items:center!important;justify-content:center!important;flex-direction:column!important;gap:3px!important;height:46px!important;min-width:51px!important;margin:0!important;padding:1px 4px!important;color:#104886!important;text-decoration:none!important;border:0!important;background:transparent!important;box-shadow:none!important;white-space:nowrap!important;font-size:11px!important;font-weight:500!important}
body #header .navigation-buttons .okla-header-support svg{width:23px!important;height:23px!important;stroke:currentColor!important;fill:none!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important}
body #header .navigation-buttons .cart-count{position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;min-width:105px!important;max-width:none!important;height:48px!important;margin:0!important;padding:4px 0 4px 3px!important;border:0!important;background:transparent!important;box-shadow:none!important;color:#0875c1!important;white-space:nowrap!important;float:none!important;text-decoration:none!important}
body #header .navigation-buttons .cart-count .cart-price{display:inline-block!important;position:static!important;float:none!important;font-size:13px!important;font-weight:600!important;color:#086bad!important;line-height:1.25!important;white-space:nowrap!important;margin-left:2px!important}
body #header .navigation-buttons .okla-header-account:hover,body #header .navigation-buttons .okla-header-support:hover{color:#007dc9!important;text-decoration:none!important}
body #header .navigation-buttons .okla-mobile-actions{display:none!important}
}
@media(min-width:992px) and (max-width:1199px){
body #header .header-top{grid-template-columns:minmax(155px,.8fr) minmax(275px,1.25fr) minmax(260px,1fr)!important;gap:10px!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy strong{font-size:12px!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy small{font-size:10px!important}
body #header .navigation-buttons .okla-header-support{min-width:43px!important}
body #header .navigation-buttons .cart-count{min-width:88px!important}
}
@media(max-width:991px){
body .top-navigation-bar{display:none!important}
body #header .navigation-buttons .okla-header-account,body #header .navigation-buttons .okla-header-support{display:none!important}
body #header .navigation-buttons .okla-mobile-actions{display:flex!important;position:static!important;align-items:center!important;justify-content:center!important;gap:3px!important;width:auto!important;height:auto!important;margin:0 5px 0 0!important;padding:0!important;background:none!important;visibility:visible!important;float:none!important}
body #header .navigation-buttons .okla-mobile-actions .toggle-window{display:inline-flex!important;position:relative!important;align-items:center!important;justify-content:center!important;min-width:32px!important;width:32px!important;height:39px!important;margin:0!important;padding:0!important;visibility:visible!important}
body #header .header-top>.navigation-buttons.okla-header-ready{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:4px!important}
}
@media(max-width:767px){
body #header .header-top{min-height:66px!important}
body #header .navigation-buttons .okla-mobile-actions{gap:0!important;margin-right:2px!important}
body #header .navigation-buttons .okla-mobile-actions .toggle-window{width:29px!important;min-width:29px!important}
}
/* V27 – synchronized three native Shoptet header actions with custom SVG iconography. */
@media(min-width:992px){
body #header .header-top{grid-template-columns:minmax(170px,.9fr) minmax(310px,620px) minmax(340px,1.12fr)!important;gap:clamp(12px,1.8vw,30px)!important;min-height:92px!important}
body #header .header-top>.navigation-buttons.okla-header-ready{display:grid!important;grid-template-columns:minmax(145px,1.28fr) minmax(65px,.62fr) minmax(118px,1fr)!important;align-items:center!important;justify-content:end!important;column-gap:clamp(7px,.8vw,13px)!important;width:100%!important;min-width:0!important;max-width:440px!important;height:64px!important;margin:0!important;padding:0!important}
body #header .navigation-buttons .okla-header-account{display:flex!important;grid-column:1!important;justify-content:flex-start!important;align-items:center!important;gap:10px!important;width:100%!important;max-width:none!important;height:60px!important;padding:0!important;border:0!important;border-radius:7px!important;box-sizing:border-box!important}
body #header .navigation-buttons .okla-header-account .okla-header-icon{display:grid!important;flex:0 0 39px!important;width:39px!important;height:39px!important;border-radius:50%!important;background:#eaf1f8!important;color:#134480!important}
body #header .navigation-buttons .okla-header-account .okla-header-icon svg{width:23px!important;height:23px!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy{gap:4px!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy strong{font-size:15px!important;line-height:18px!important;color:#092e62!important;white-space:nowrap!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy small{font-size:12px!important;line-height:15px!important;color:#1d64a0!important;white-space:nowrap!important}
body #header .navigation-buttons .okla-header-support{display:flex!important;grid-column:2!important;align-items:center!important;justify-content:center!important;gap:4px!important;flex-direction:column!important;position:relative!important;min-width:0!important;width:100%!important;height:58px!important;margin:0!important;padding:2px 0!important;font-size:11px!important;line-height:15px!important;color:#12447e!important;background:transparent!important;border:none!important;box-shadow:none!important}
body #header .navigation-buttons .okla-header-support::before,body #header .navigation-buttons .okla-header-support::after{content:none!important;display:none!important}
body #header .navigation-buttons .okla-header-support svg{display:block!important;width:27px!important;height:27px!important;max-width:27px!important;stroke:#13477f!important;fill:none!important;stroke-width:1.7!important;stroke-linecap:round!important;stroke-linejoin:round!important}
body #header .navigation-buttons .okla-header-support span{display:block!important;color:#184f8b!important;font-size:11px!important;font-weight:500!important;line-height:15px!important}
body #header .navigation-buttons .cart-count{display:flex!important;grid-column:3!important;align-items:center!important;justify-content:center!important;gap:6px!important;position:relative!important;width:100%!important;min-width:0!important;height:60px!important;margin:0!important;padding:0 0 0 5px!important;background:transparent!important;border:0!important;box-shadow:none!important}
body #header .navigation-buttons .cart-count::before{content:none!important;display:none!important}
body #header .navigation-buttons .cart-count .okla-cart-symbol{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 37px!important;width:37px!important;height:41px!important;color:#0877c3!important}
body #header .navigation-buttons .cart-count .okla-cart-symbol svg{display:block!important;width:32px!important;height:32px!important;fill:none!important;stroke:#0077c3!important;stroke-width:1.65!important;stroke-linecap:round!important;stroke-linejoin:round!important}
body #header .navigation-buttons .cart-count .cart-price{display:block!important;min-width:0!important;margin:0!important;font-size:13px!important;font-weight:600!important;line-height:1.35!important;white-space:nowrap!important;color:#0b70b5!important}
body #header .navigation-buttons .okla-header-account:hover,body #header .navigation-buttons .okla-header-support:hover,body #header .navigation-buttons .cart-count:hover{background:#f5f9fd!important;text-decoration:none!important}
}
@media(min-width:992px) and (max-width:1199px){
body #header .header-top{grid-template-columns:minmax(156px,.7fr) minmax(275px,1.1fr) minmax(310px,1.15fr)!important;gap:10px!important}
body #header .header-top>.navigation-buttons.okla-header-ready{grid-template-columns:minmax(132px,1.2fr) minmax(57px,.5fr) minmax(106px,.85fr)!important;column-gap:5px!important}
body #header .navigation-buttons .okla-header-account .okla-header-icon{width:36px!important;height:36px!important;flex-basis:36px!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy strong{font-size:13px!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy small{font-size:11px!important}
body #header .navigation-buttons .cart-count .cart-price{font-size:12px!important}
}
@media(max-width:991px){
body #header .navigation-buttons .okla-header-account,body #header .navigation-buttons .okla-header-support{display:none!important}
body #header .navigation-buttons .cart-count .okla-cart-symbol{display:none!important}
}
/* V27 – informative warranty strip between the two product sliders. */
#content .okla-warranty-strip{display:grid!important;grid-template-columns:minmax(220px,1.55fr) repeat(3,minmax(120px,1fr)) auto!important;align-items:stretch!important;gap:11px!important;box-sizing:border-box!important;width:100%!important;min-width:0!important;margin:27px 0 30px!important;padding:17px 18px!important;border-radius:10px!important;background:#eef3fc!important;color:#143660!important}
#content .okla-warranty-intro{display:flex!important;align-items:center!important;gap:14px!important;min-width:0!important;padding:7px 2px!important}
#content .okla-warranty-main-icon{display:grid!important;place-items:center!important;flex:0 0 49px!important;width:49px!important;height:49px!important;color:#165099!important;background:#dce9fa!important;border-radius:12px!important}
#content .okla-warranty-main-icon svg{width:29px!important;height:29px!important;stroke:currentColor!important;fill:none!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important}
#content .okla-warranty-copy{display:flex!important;flex-direction:column!important;gap:5px!important;min-width:0!important}
#content .okla-warranty-copy strong{font-size:21px!important;font-weight:800!important;line-height:1.2!important;letter-spacing:-.3px!important;color:#112c56!important}
#content .okla-warranty-copy span{font-size:12px!important;font-weight:400!important;line-height:1.45!important;color:#546985!important}
#content .okla-warranty-feature{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:6px!important;min-width:0!important;min-height:105px!important;padding:13px 9px!important;border:1px solid #e2e7ef!important;border-radius:9px!important;box-sizing:border-box!important;background:#fff!important;box-shadow:0 1px 3px rgba(12,42,92,.09)!important;text-align:center!important}
#content .okla-warranty-feature svg{flex:0 0 28px!important;width:28px!important;height:28px!important;stroke:#18549a!important;fill:none!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important}
#content .okla-warranty-feature strong{font-size:13px!important;font-weight:700!important;line-height:1.15!important;color:#163d76!important}
#content .okla-warranty-feature small{font-size:11px!important;font-weight:400!important;line-height:1.3!important;color:#67758a!important}
#content .okla-warranty-more{display:inline-flex!important;align-items:center!important;justify-content:center!important;align-self:center!important;gap:5px!important;min-width:64px!important;height:38px!important;padding:0 6px!important;border:1px solid #bed4ed!important;border-radius:7px!important;background:#fff!important;color:#0b4e9f!important;font-size:13px!important;font-weight:700!important;text-decoration:none!important;white-space:nowrap!important}
#content .okla-warranty-more:hover{background:#e7f1ff!important;border-color:#86b3df!important;text-decoration:none!important}
#content .okla-warranty-more:focus-visible{outline:2px solid #1571c2!important;outline-offset:2px!important}
#content .okla-warranty-more svg{width:15px!important;height:15px!important;stroke:currentColor!important;fill:none!important;stroke-width:2!important}
@media(min-width:768px) and (max-width:1199px){#content .okla-warranty-strip{grid-template-columns:minmax(215px,1.3fr) repeat(2,minmax(130px,1fr)) auto!important;gap:8px!important;padding:15px 13px!important}#content .okla-warranty-feature:nth-of-type(4){display:none!important}#content .okla-warranty-copy strong{font-size:18px!important}}
@media(max-width:767px){#content .okla-warranty-strip{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;margin:22px 0 25px!important;padding:13px!important}#content .okla-warranty-intro{grid-column:1/-1!important;padding:2px!important}#content .okla-warranty-copy strong{font-size:18px!important}#content .okla-warranty-main-icon{width:40px!important;height:40px!important;flex-basis:40px!important}#content .okla-warranty-main-icon svg{width:24px!important;height:24px!important}#content .okla-warranty-feature{min-height:88px!important;padding:10px 7px!important}#content .okla-warranty-feature:nth-of-type(4){grid-column:1/-1!important;min-height:70px!important}#content .okla-warranty-more{grid-column:1/-1!important;justify-self:end!important}}
/* V27 – tighter but balanced product typography / price and imagery proportions. */
@media(min-width:992px){
#content .okla-slider-track>.product .p{padding:9px 10px 17px!important}
#content .okla-slider-track>.product .p>a.image{height:clamp(176px,14.5vw,205px)!important;min-height:176px!important;max-height:205px!important;margin-bottom:8px!important}
#content .okla-slider-track>.product .p>a.image img{transform:scale(1.12)!important}
#content .okla-slider-track .ratings-wrapper.okla-ratings{margin-bottom:7px!important;min-height:21px!important}
#content .okla-slider-track a.name{font-size:14px!important;font-weight:600!important;line-height:21px!important;height:44px!important;min-height:44px!important;max-height:44px!important;margin-bottom:6px!important}
#content .okla-slider-track .prices{width:144px!important;min-height:68px!important;height:68px!important;margin-top:11px!important}
#content .okla-slider-track .price-final strong{font-size:20px!important;line-height:28px!important}
#content .okla-slider-track .p-tools{margin-top:17px!important}
#content .okla-slider-track .p-tools .btn-cart{width:144px!important;height:39px!important;min-height:39px!important;font-size:12px!important}
}
/* OKLA V28: final account prominence and alignment polish, no positional shifts. */
@media(min-width:1200px){
body #header .navigation-buttons .okla-header-account{gap:10px!important;height:62px!important}
body #header .navigation-buttons .okla-header-account .okla-header-icon{flex:0 0 43px!important;width:43px!important;height:43px!important}
body #header .navigation-buttons .okla-header-account .okla-header-icon svg{width:24px!important;height:24px!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy strong{font-size:16px!important;line-height:19px!important;font-weight:800!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy small{font-size:12.5px!important;line-height:16px!important}
}
@media(min-width:992px) and (max-width:1199px){
body #header .navigation-buttons .okla-header-account .okla-header-icon{width:39px!important;height:39px!important;flex-basis:39px!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy strong{font-size:14px!important;line-height:17px!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy small{font-size:11.5px!important}
}
/* OKLA V29: crisp Alza-inspired utility row; native buttons, no hover backgrounds or animations. */
@media(min-width:992px){
body #header .header-top>.navigation-buttons.okla-header-ready{display:flex!important;align-items:center!important;justify-content:flex-end!important;column-gap:0!important;gap:0!important;width:100%!important;max-width:440px!important;height:58px!important;margin:0!important;padding:0!important}
body #header .navigation-buttons .okla-header-account{position:relative!important;display:flex!important;flex:0 0 auto!important;grid-column:auto!important;align-items:center!important;justify-content:flex-start!important;gap:9px!important;width:auto!important;max-width:none!important;min-width:0!important;height:49px!important;min-height:49px!important;margin:0!important;padding:0 15px 0 2px!important;border:0!important;border-radius:0!important;background:transparent!important;color:#173f76!important;box-shadow:none!important;transform:none!important;transition:none!important;opacity:1!important;filter:none!important}
body #header .navigation-buttons .okla-header-account .okla-header-icon{display:grid!important;flex:0 0 34px!important;width:34px!important;height:34px!important;min-width:34px!important;border-radius:50%!important;background:#edf1f5!important;color:#0d396c!important;box-shadow:none!important}
body #header .navigation-buttons .okla-header-account .okla-header-icon svg{display:block!important;width:20px!important;height:20px!important;stroke:currentColor!important;stroke-width:1.85!important;fill:none!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:3px!important;min-width:0!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy strong{font-size:13px!important;line-height:16px!important;letter-spacing:0!important;font-weight:750!important;color:#092d5c!important;white-space:nowrap!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy small{font-size:11px!important;line-height:14px!important;font-weight:400!important;color:#19477e!important;white-space:nowrap!important}
body #header .navigation-buttons .okla-header-account::after{content:""!important;display:block!important;position:relative!important;flex:0 0 7px!important;width:7px!important;height:7px!important;min-width:7px!important;margin:0 0 5px 6px!important;padding:0!important;border:0!important;border-right:1.5px solid #9ba9b9!important;border-bottom:1.5px solid #9ba9b9!important;background:transparent!important;transform:rotate(45deg)!important;box-shadow:none!important;pointer-events:none!important}
body #header .navigation-buttons .okla-header-support{display:flex!important;position:relative!important;flex:0 0 69px!important;grid-column:auto!important;align-items:center!important;justify-content:center!important;gap:3px!important;width:69px!important;min-width:69px!important;height:40px!important;min-height:40px!important;margin:0!important;padding:1px 5px!important;border:0!important;border-left:1px solid #dce1e8!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;transform:none!important;transition:none!important;color:#143f78!important}
body #header .navigation-buttons .okla-header-support svg{width:23px!important;height:23px!important;max-width:23px!important;stroke:currentColor!important;stroke-width:1.7!important}
body #header .navigation-buttons .okla-header-support span{font-size:10px!important;line-height:11px!important;font-weight:500!important;color:#143f78!important}
body #header .navigation-buttons .cart-count{display:flex!important;position:relative!important;flex:0 0 auto!important;grid-column:auto!important;align-items:center!important;justify-content:center!important;gap:6px!important;width:auto!important;max-width:none!important;min-width:117px!important;height:40px!important;min-height:40px!important;margin:0!important;padding:0 4px 0 13px!important;border:0!important;border-left:1px solid #dce1e8!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;transform:none!important;transition:none!important;color:#0b69ae!important}
body #header .navigation-buttons .cart-count .okla-cart-symbol{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 34px!important;width:34px!important;height:38px!important;color:#006eb6!important}
body #header .navigation-buttons .cart-count .okla-cart-symbol svg{width:29px!important;height:29px!important;stroke:#0075c2!important;stroke-width:1.7!important;fill:none!important}
body #header .navigation-buttons .cart-count .cart-price{display:block!important;position:static!important;float:none!important;margin:0!important;padding:0!important;font-size:12px!important;line-height:16px!important;font-weight:600!important;color:#096bb2!important;white-space:nowrap!important}
body #header .navigation-buttons .okla-header-account:hover,
body #header .navigation-buttons .okla-header-account:active,
body #header .navigation-buttons .okla-header-account:focus,
body #header .navigation-buttons .okla-header-support:hover,
body #header .navigation-buttons .okla-header-support:active,
body #header .navigation-buttons .okla-header-support:focus,
body #header .navigation-buttons .cart-count:hover,
body #header .navigation-buttons .cart-count:active,
body #header .navigation-buttons .cart-count:focus{background:transparent!important;color:inherit!important;text-decoration:none!important;box-shadow:none!important;filter:none!important;opacity:1!important;transform:none!important}
body #header .navigation-buttons .okla-header-account:hover .okla-header-icon,
body #header .navigation-buttons .okla-header-support:hover svg,
body #header .navigation-buttons .cart-count:hover .okla-cart-symbol{transform:none!important;filter:none!important;box-shadow:none!important}
}
@media(min-width:992px) and (max-width:1199px){
body #header .navigation-buttons .okla-header-account{padding-right:9px!important;gap:7px!important}
body #header .navigation-buttons .okla-header-account .okla-header-icon{width:32px!important;height:32px!important;min-width:32px!important;flex-basis:32px!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy strong{font-size:12px!important}
body #header .navigation-buttons .okla-header-account .okla-header-copy small{font-size:10px!important}
body #header .navigation-buttons .okla-header-support{flex-basis:58px!important;width:58px!important;min-width:58px!important}
body #header .navigation-buttons .cart-count{min-width:100px!important;padding-left:8px!important}
body #header .navigation-buttons .cart-count .cart-price{font-size:11px!important}
}
/* OKLA V30 – true flat Alza-like header, no inherited Shoptet button hover surfaces. */
@media(min-width:992px){
body #header .header-top>.navigation-buttons.okla-header-ready{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:0!important;column-gap:0!important;width:100%!important;max-width:428px!important;min-width:0!important;height:56px!important;min-height:56px!important;margin:0!important;padding:0!important;border:0!important;box-shadow:none!important;background:transparent!important}
body #header .header-top>.navigation-buttons.okla-header-ready>a,
body #header .header-top>.navigation-buttons.okla-header-ready>button{position:relative!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:none!important;margin:0!important;box-sizing:border-box!important;border-radius:0!important;border-top:0!important;border-right:0!important;border-bottom:0!important;outline-offset:3px!important;background:transparent!important;background-color:transparent!important;background-image:none!important;box-shadow:none!important;text-shadow:none!important;filter:none!important;transform:none!important;transition:none!important;opacity:1!important;text-decoration:none!important;vertical-align:middle!important;cursor:pointer!important}
body #header .header-top>.navigation-buttons.okla-header-ready>a:hover,
body #header .header-top>.navigation-buttons.okla-header-ready>button:hover,
body #header .header-top>.navigation-buttons.okla-header-ready>a:active,
body #header .header-top>.navigation-buttons.okla-header-ready>button:active,
body #header .header-top>.navigation-buttons.okla-header-ready>a:focus,
body #header .header-top>.navigation-buttons.okla-header-ready>button:focus,
body #header .header-top>.navigation-buttons.okla-header-ready>a:focus-visible,
body #header .header-top>.navigation-buttons.okla-header-ready>button:focus-visible{background:transparent!important;background-color:transparent!important;background-image:none!important;box-shadow:none!important;text-shadow:none!important;filter:none!important;transform:none!important;opacity:1!important;text-decoration:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-account{justify-content:flex-start!important;gap:9px!important;min-width:0!important;max-width:none!important;width:auto!important;height:48px!important;min-height:48px!important;padding:0 12px 0 0!important;border:0!important;color:#0a3267!important;font-family:'Roboto',Arial,sans-serif!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-account::before,
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-account::after{display:none!important;content:none!important;box-shadow:none!important;background:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-icon{display:grid!important;place-items:center!important;flex:0 0 33px!important;width:33px!important;min-width:33px!important;height:33px!important;min-height:33px!important;margin:0!important;padding:0!important;border-radius:50%!important;background:#edf1f5!important;color:#123b72!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-icon svg{display:block!important;width:21px!important;height:21px!important;stroke:#123b72!important;fill:none!important;stroke-width:1.85!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-copy{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:2px!important;line-height:1.1!important;text-align:left!important;min-width:0!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-copy strong{display:block!important;font-size:13px!important;font-weight:700!important;line-height:16px!important;color:#072e5f!important;white-space:nowrap!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-copy small{display:block!important;font-size:11px!important;font-weight:400!important;line-height:14px!important;color:#0c4a8a!important;white-space:nowrap!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-chevron{display:block!important;width:8px!important;height:8px!important;flex:0 0 8px!important;margin:0 0 4px 4px!important;border-right:1.5px solid #95a2b3!important;border-bottom:1.5px solid #95a2b3!important;transform:rotate(45deg)!important;pointer-events:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-shortcut{display:flex!important;flex:0 0 41px!important;width:41px!important;min-width:41px!important;height:35px!important;min-height:35px!important;margin:0!important;padding:0!important;border-left:1px solid #dde1e7!important;color:#082e61!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-shortcut svg{display:block!important;width:21px!important;height:21px!important;stroke:#0c3369!important;fill:none!important;stroke-width:1.9!important;stroke-linecap:round!important;stroke-linejoin:round!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-shortcut:hover,
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-shortcut:active,
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-shortcut:focus{color:#082e61!important;background:transparent!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-support{flex:0 0 42px!important;grid-column:auto!important;width:42px!important;min-width:42px!important;height:35px!important;min-height:35px!important;max-width:none!important;margin:0!important;padding:0!important;border-left:1px solid #dde1e7!important;border-radius:0!important;gap:0!important;color:#082e61!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-support svg{display:block!important;width:23px!important;height:23px!important;stroke:#0c3369!important;fill:none!important;stroke-width:1.85!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-support span{display:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready .cart-count{display:flex!important;grid-column:auto!important;position:relative!important;justify-content:center!important;align-items:center!important;flex:0 0 auto!important;gap:6px!important;width:auto!important;max-width:none!important;min-width:105px!important;height:35px!important;min-height:35px!important;margin:0!important;padding:0 0 0 9px!important;border-left:1px solid #dde1e7!important;border-radius:0!important;box-shadow:none!important;background:transparent!important;background-color:transparent!important;background-image:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready .cart-count::before{display:none!important;content:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready .cart-count .okla-cart-symbol{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 36px!important;width:36px!important;min-width:36px!important;height:35px!important;color:#7b828c!important}
body #header .header-top>.navigation-buttons.okla-header-ready .cart-count .okla-cart-symbol svg{display:block!important;width:29px!important;height:29px!important;stroke:#828993!important;stroke-width:1.7!important;fill:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready .cart-count .cart-price{display:inline-block!important;position:static!important;float:none!important;min-width:0!important;margin:0!important;padding:0!important;font-size:12px!important;line-height:16px!important;font-weight:500!important;color:#195a9c!important;white-space:nowrap!important}
body #header .header-top>.navigation-buttons.okla-header-ready .cart-count:hover .okla-cart-symbol svg,
body #header .header-top>.navigation-buttons.okla-header-ready .cart-count:hover .cart-price{color:inherit!important;filter:none!important;transform:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready>*:focus-visible{outline:2px solid #007bc6!important;outline-offset:3px!important}
}
@media(min-width:992px) and (max-width:1199px){
body #header .header-top{grid-template-columns:minmax(145px,.75fr) minmax(285px,1.15fr) minmax(330px,1.2fr)!important;gap:10px!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-account{gap:6px!important;padding-right:8px!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-copy strong{font-size:12px!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-copy small{font-size:10px!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-shortcut{width:37px!important;min-width:37px!important;flex-basis:37px!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-support{width:38px!important;min-width:38px!important;flex-basis:38px!important}
body #header .header-top>.navigation-buttons.okla-header-ready .cart-count{min-width:98px!important;gap:3px!important}
body #header .header-top>.navigation-buttons.okla-header-ready .cart-count .cart-price{font-size:11px!important}
}
@media(max-width:991px){
body #header .header-top>.navigation-buttons .okla-header-shortcut{display:none!important}
body #header .header-top>.navigation-buttons .okla-header-chevron{display:none!important}
}
/* OKLA V31 – measured 1:1 Alza screenshot composition (account | order bag | heart | CZ flag | gray cart). */
@media(min-width:992px){
body #header .header-top>.navigation-buttons.okla-header-ready{display:flex!important;flex-direction:row!important;justify-content:flex-end!important;align-items:center!important;gap:0!important;column-gap:0!important;width:100%!important;max-width:350px!important;min-width:0!important;min-height:54px!important;height:54px!important;margin:0!important;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important}
body #header .header-top>.navigation-buttons.okla-header-ready>*{box-sizing:border-box!important;vertical-align:middle!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-account{display:flex!important;position:relative!important;flex:0 0 155px!important;justify-content:flex-start!important;align-items:center!important;gap:9px!important;width:155px!important;min-width:155px!important;max-width:155px!important;height:47px!important;min-height:47px!important;margin:0!important;padding:0 12px 0 0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;filter:none!important;opacity:1!important;transform:none!important;transition:none!important;color:#082c61!important;cursor:pointer!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-account::before,
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-account::after{content:none!important;display:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-account .okla-header-icon{display:grid!important;place-items:center!important;flex:0 0 32px!important;width:32px!important;min-width:32px!important;height:32px!important;min-height:32px!important;margin:0!important;padding:0!important;border-radius:50%!important;background:#e9edf1!important;box-shadow:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-account .okla-header-icon svg{display:block!important;width:20px!important;height:20px!important;stroke:none!important;fill:#0b3265!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-account .okla-header-icon svg path{stroke:none!important;fill:#0b3265!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-account .okla-header-copy{display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:flex-start!important;flex:0 0 auto!important;gap:2px!important;min-width:0!important;height:auto!important;margin:0!important;line-height:1.15!important;text-align:left!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-account .okla-header-copy strong{font-size:13px!important;font-weight:700!important;line-height:16px!important;letter-spacing:0!important;color:#0a2f61!important;white-space:nowrap!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-account .okla-header-copy small{font-size:11px!important;font-weight:400!important;line-height:14px!important;color:#0c356a!important;white-space:nowrap!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-account .okla-header-chevron{display:block!important;flex:0 0 8px!important;width:8px!important;height:8px!important;margin:-4px 0 0 6px!important;border:0!important;border-right:1.5px solid #9a9fa5!important;border-bottom:1.5px solid #9a9fa5!important;background:transparent!important;box-shadow:none!important;transform:rotate(45deg)!important;pointer-events:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-orders,
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-favorites,
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-locale{display:inline-flex!important;position:relative!important;flex:0 0 45px!important;align-items:center!important;justify-content:center!important;width:45px!important;min-width:45px!important;max-width:45px!important;height:35px!important;min-height:35px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;transition:none!important;transform:none!important;opacity:1!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-orders{border-left:1px solid #dfe2e7!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-orders svg{display:block!important;width:21px!important;height:24px!important;fill:none!important;stroke:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-orders svg .okla-bag-body{fill:#062b5e!important;stroke:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-orders svg .okla-bag-check{fill:none!important;stroke:#fff!important;stroke-width:1.7!important;stroke-linecap:round!important;stroke-linejoin:round!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-favorites svg{display:block!important;width:25px!important;height:25px!important;stroke:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-favorites svg path{fill:#062b5e!important;stroke:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-locale{cursor:default!important;pointer-events:auto!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-locale svg{display:block!important;width:29px!important;height:29px!important;border:1px solid #e0e4ea!important;border-radius:50%!important;overflow:hidden!important;box-shadow:0 0 0 1px rgba(0,0,0,.018)!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.cart-count{display:inline-flex!important;position:relative!important;flex:0 0 45px!important;align-items:center!important;justify-content:center!important;gap:0!important;width:45px!important;min-width:45px!important;max-width:45px!important;height:35px!important;min-height:35px!important;margin:0!important;padding:0!important;border:0!important;border-left:1px solid #dfe2e7!important;border-radius:0!important;background:transparent!important;background-color:transparent!important;background-image:none!important;box-shadow:none!important;transform:none!important;transition:none!important;filter:none!important;opacity:1!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.cart-count::before,
body #header .header-top>.navigation-buttons.okla-header-ready>.cart-count::after{content:none!important;display:none!important;background:none!important;box-shadow:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.cart-count .okla-cart-symbol{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 30px!important;width:30px!important;min-width:30px!important;height:30px!important;margin:0!important;color:#999da2!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.cart-count .okla-cart-symbol svg{display:block!important;width:28px!important;height:28px!important;fill:none!important;stroke:#a0a1a4!important;stroke-width:1.5!important;stroke-linecap:round!important;stroke-linejoin:round!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.cart-count .okla-cart-symbol svg path{stroke:#a0a1a4!important;fill:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.cart-count .cart-price{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;clip-path:inset(50%)!important;white-space:nowrap!important;margin:0!important;padding:0!important;border:0!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-account:hover,
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-orders:hover,
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-favorites:hover,
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-locale:hover,
body #header .header-top>.navigation-buttons.okla-header-ready>.cart-count:hover,
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-account:active,
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-orders:active,
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-favorites:active,
body #header .header-top>.navigation-buttons.okla-header-ready>.cart-count:active,
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-account:focus,
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-orders:focus,
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-favorites:focus,
body #header .header-top>.navigation-buttons.okla-header-ready>.cart-count:focus{background:transparent!important;background-color:transparent!important;background-image:none!important;box-shadow:none!important;filter:none!important;transform:none!important;opacity:1!important;text-decoration:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready>*:focus-visible{outline:2px solid #006fc2!important;outline-offset:2px!important}
}
@media(min-width:992px) and (max-width:1199px){
body #header .header-top>.navigation-buttons.okla-header-ready{max-width:310px!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-account{width:142px!important;min-width:142px!important;max-width:142px!important;flex-basis:142px!important;gap:6px!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-orders,
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-favorites,
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-locale,
body #header .header-top>.navigation-buttons.okla-header-ready>.cart-count{width:42px!important;min-width:42px!important;max-width:42px!important;flex-basis:42px!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-account .okla-header-copy strong{font-size:12px!important}
body #header .header-top>.navigation-buttons.okla-header-ready .okla-header-account .okla-header-copy small{font-size:10px!important}
}
@media(max-width:991px){
body #header .navigation-buttons .okla-header-orders,
body #header .navigation-buttons .okla-header-favorites,
body #header .navigation-buttons .okla-header-locale{display:none!important}
}
#okla-favorites-popover{position:fixed!important;inset:0!important;z-index:999999!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:16px!important;background:rgba(9,27,49,.38)!important}
#okla-favorites-popover[hidden]{display:none!important}
#okla-favorites-popover .okla-fav-window{width:min(480px,96vw)!important;max-height:78vh!important;overflow:auto!important;border-radius:12px!important;background:#fff!important;padding:20px!important;box-shadow:0 12px 40px rgba(4,20,45,.20)!important}
#okla-favorites-popover .okla-fav-head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:14px!important;margin-bottom:15px!important}
#okla-favorites-popover .okla-fav-head strong{font-size:20px!important;color:#092e60!important}
#okla-favorites-popover .okla-fav-head button{border:0!important;background:none!important;font-size:23px!important;color:#283a52!important;cursor:pointer!important}
#okla-favorites-popover .okla-fav-empty{font-size:14px!important;line-height:1.6!important;color:#47596c!important}
#okla-favorites-popover .okla-fav-row{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;padding:13px 0!important;border-top:1px solid #edf0f4!important}
#okla-favorites-popover .okla-fav-row a{font-size:14px!important;color:#174b90!important;line-height:1.35!important}
#okla-favorites-popover .okla-fav-row button{border:0!important;background:#eef3fa!important;border-radius:5px!important;color:#18416f!important;font-size:12px!important;padding:6px 8px!important;cursor:pointer!important}
#content .product .p{position:relative!important}
#content .product .p .okla-fav-toggle{position:absolute!important;top:5px!important;right:6px!important;z-index:5!important;display:grid!important;place-items:center!important;width:29px!important;height:29px!important;margin:0!important;padding:0!important;border:1px solid #e0e8f1!important;border-radius:50%!important;background:#fff!important;box-shadow:0 1px 4px rgba(23,39,64,.08)!important;color:#16467c!important;cursor:pointer!important}
#content .product .p .okla-fav-toggle svg{display:block!important;width:17px!important;height:17px!important;stroke:currentColor!important;stroke-width:1.8!important;fill:none!important}
#content .product .p .okla-fav-toggle[aria-pressed=true] svg{fill:#123c75!important;stroke:#123c75!important}
/* OKLA V32 – force solid reference fills over Shoptet icon reset; visible saved-state feedback. */
@media(min-width:992px){
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-orders svg path.okla-bag-body{fill:#062b5e!important;stroke:none!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-orders svg path.okla-bag-check{fill:none!important;stroke:#fff!important;stroke-width:1.7!important}
body #header .header-top>.navigation-buttons.okla-header-ready>.okla-header-favorites svg path{fill:#062b5e!important;stroke:none!important}
}
#content .product .p .okla-fav-toggle[aria-pressed=true] svg path{fill:#123c75!important;stroke:#123c75!important}
#content .product .p .okla-fav-toggle[aria-pressed=false] svg path{fill:none!important;stroke:#123c75!important}
/* OKLA V33: Alza-style compact horizontal warranty showcase – real HTML and interactive carousel, not an image. */
#content .okla-warranty-strip{display:grid!important;grid-template-columns:minmax(220px,31%) minmax(0,1fr)!important;align-items:center!important;gap:17px!important;position:relative!important;width:100%!important;min-width:0!important;min-height:147px!important;max-width:100%!important;margin:25px 0 28px!important;padding:14px 17px!important;box-sizing:border-box!important;border:0!important;border-radius:0!important;overflow:hidden!important;background:#eef3fc!important;background-image:linear-gradient(100deg,#eff5ff 0%,#edf3fc 55%,#eaf1fd 100%)!important;color:#102b56!important;box-shadow:none!important}
#content .okla-warranty-intro{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:8px!important;min-width:0!important;min-height:0!important;margin:0!important;padding:0 0 0 2px!important;background:transparent!important}
#content .okla-warranty-main-icon{display:none!important}
#content .okla-warranty-copy{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:1px!important;min-width:0!important}
#content .okla-warranty-copy strong{display:block!important;color:#061831!important;font-family:'Roboto',Arial,sans-serif!important;font-size:clamp(18px,1.52vw,22px)!important;font-weight:800!important;line-height:1.17!important;letter-spacing:-.2px!important}
#content .okla-warranty-copy .okla-warranty-subtitle{display:block!important;color:#061831!important;font-size:clamp(15px,1.22vw,19px)!important;font-weight:700!important;line-height:1.28!important;letter-spacing:0!important}
#content .okla-warranty-copy .okla-warranty-legal{display:block!important;color:#586a80!important;font-size:10px!important;font-weight:400!important;line-height:1.25!important;margin-top:3px!important}
#content .okla-warranty-more{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:4px!important;align-self:auto!important;min-width:0!important;width:auto!important;max-width:100%!important;min-height:32px!important;height:32px!important;margin:1px 0 0!important;padding:0 13px!important;border:0!important;border-radius:5px!important;background:#17499f!important;color:#fff!important;font-family:'Roboto',Arial,sans-serif!important;font-size:12px!important;font-weight:700!important;line-height:1.15!important;text-decoration:none!important;white-space:nowrap!important;box-shadow:none!important}
#content .okla-warranty-more:hover,#content .okla-warranty-more:focus{background:#17499f!important;color:#fff!important;text-decoration:none!important;box-shadow:none!important;filter:none!important}
#content .okla-warranty-more:focus-visible{outline:2px solid #08498e!important;outline-offset:2px!important}
#content .okla-warranty-carousel{display:block!important;position:relative!important;min-width:0!important;width:100%!important;max-width:100%!important;overflow:hidden!important;padding:1px 0 3px!important}
#content .okla-warranty-cards{display:flex!important;align-items:stretch!important;gap:9px!important;min-width:0!important;width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none!important;-ms-overflow-style:none!important;scroll-behavior:smooth!important;scroll-snap-type:x mandatory!important;padding:1px 3px 4px!important;box-sizing:border-box!important}
#content .okla-warranty-cards::-webkit-scrollbar{display:none!important}
#content .okla-warranty-feature{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;flex:0 0 calc((100% - 36px)/4)!important;gap:7px!important;min-width:0!important;min-height:113px!important;max-height:113px!important;margin:0!important;padding:12px 7px!important;border:1px solid #dfe5ee!important;border-radius:8px!important;background:#fff!important;box-shadow:0 1px 4px rgba(15,43,82,.12)!important;text-align:center!important;box-sizing:border-box!important;scroll-snap-align:start!important;overflow:hidden!important}
#content .okla-warranty-feature svg{display:block!important;flex:0 0 30px!important;width:30px!important;height:30px!important;margin:0!important;stroke:#16519c!important;stroke-width:1.75!important;fill:none!important;stroke-linecap:round!important;stroke-linejoin:round!important}
#content .okla-warranty-feature strong{display:block!important;color:#103e82!important;font-family:'Roboto',Arial,sans-serif!important;font-size:13px!important;font-weight:750!important;line-height:1.2!important;white-space:normal!important}
#content .okla-warranty-feature small{display:block!important;color:#4e5c70!important;font-family:'Roboto',Arial,sans-serif!important;font-size:11px!important;font-weight:400!important;line-height:1.3!important;white-space:normal!important}
#content .okla-warranty-arrow{display:flex!important;align-items:center!important;justify-content:center!important;position:absolute!important;top:50%!important;right:0!important;z-index:2!important;width:31px!important;height:63px!important;margin:0!important;padding:0!important;border:0!important;border-radius:5px 0 0 5px!important;background:#173f8d!important;color:#fff!important;box-shadow:none!important;transform:translateY(-50%)!important;cursor:pointer!important}
#content .okla-warranty-arrow svg{width:17px!important;height:17px!important;stroke:#fff!important;stroke-width:3!important;fill:none!important;stroke-linecap:round!important;stroke-linejoin:round!important}
#content .okla-warranty-arrow:hover,#content .okla-warranty-arrow:focus{background:#173f8d!important;color:#fff!important;box-shadow:none!important}
#content .okla-warranty-arrow:focus-visible{outline:2px solid #0b366d!important;outline-offset:-3px!important}
@media(min-width:768px) and (max-width:1199px){
#content .okla-warranty-strip{grid-template-columns:minmax(175px,31%) minmax(0,1fr)!important;gap:10px!important;padding:11px!important;min-height:139px!important}
#content .okla-warranty-feature{flex-basis:calc((100% - 20px)/3)!important;min-height:110px!important;max-height:110px!important}
#content .okla-warranty-copy strong{font-size:18px!important}
#content .okla-warranty-copy .okla-warranty-subtitle{font-size:14px!important}
}
@media(max-width:767px){
#content .okla-warranty-strip{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:13px!important;margin:19px 0 23px!important;padding:15px 12px!important;min-height:0!important}
#content .okla-warranty-intro{display:flex!important;flex-direction:column!important;align-items:flex-start!important;min-width:0!important;gap:7px!important;padding:0!important}
#content .okla-warranty-copy strong{font-size:20px!important}
#content .okla-warranty-copy .okla-warranty-subtitle{font-size:15px!important}
#content .okla-warranty-carousel{width:100%!important;grid-column:auto!important;padding:0!important}
#content .okla-warranty-cards{gap:9px!important}
#content .okla-warranty-feature{flex:0 0 calc((100% - 12px)/2)!important;min-height:114px!important;max-height:114px!important;padding:10px 6px!important;grid-column:auto!important}
#content .okla-warranty-arrow{width:29px!important;height:51px!important}
#content .okla-warranty-more{grid-column:auto!important;align-self:auto!important;justify-self:auto!important}
}
/* OKLA V34 – edge-to-edge warranty band within main white content, CTA flush left; taller proportional cards. */
#content .okla-warranty-strip{grid-template-columns:minmax(230px,30%) minmax(0,1fr)!important;gap:21px!important;min-height:193px!important;max-width:none!important;margin-top:28px!important;margin-bottom:33px!important;padding:19px 0 19px 0!important;overflow:hidden!important;background:#eaf1fc!important;background-image:linear-gradient(95deg,#eff5ff 0%,#edf3fd 53%,#eaf1fc 100%)!important}
#content .okla-warranty-intro{gap:13px!important;min-height:0!important;padding:0!important;margin:0!important;justify-content:center!important;align-items:flex-start!important}
#content .okla-warranty-copy{gap:3px!important;align-items:flex-start!important}
#content .okla-warranty-copy strong{font-size:clamp(21px,1.85vw,26px)!important;line-height:1.2!important}
#content .okla-warranty-copy .okla-warranty-subtitle{font-size:clamp(17px,1.45vw,21px)!important;line-height:1.25!important}
#content .okla-warranty-copy .okla-warranty-legal{font-size:11px!important;line-height:1.45!important;margin-top:5px!important}
#content .okla-warranty-more{display:inline-flex!important;align-self:flex-start!important;justify-self:start!important;margin:2px 0 0 0!important;padding:0 17px!important;min-height:39px!important;height:39px!important;border-radius:5px!important;font-size:13px!important}
#content .okla-warranty-carousel{padding:2px 0 3px!important;min-width:0!important}
#content .okla-warranty-cards{gap:12px!important;padding:3px 4px 5px!important}
#content .okla-warranty-feature{flex-basis:calc((100% - 48px)/4)!important;min-height:151px!important;max-height:151px!important;padding:17px 9px!important;gap:10px!important;border-radius:9px!important;box-shadow:0 2px 5px rgba(14,48,94,.12)!important}
#content .okla-warranty-feature svg{width:37px!important;height:37px!important;flex-basis:37px!important;stroke-width:1.8!important}
#content .okla-warranty-feature strong{font-size:15px!important;line-height:1.2!important;font-weight:750!important}
#content .okla-warranty-feature small{font-size:12px!important;line-height:1.35!important}
#content .okla-warranty-arrow{right:0!important;width:33px!important;height:76px!important;border-radius:5px 0 0 5px!important}
#content .okla-warranty-arrow svg{width:18px!important;height:18px!important}
@media(min-width:768px) and (max-width:1199px){
#content .okla-warranty-strip{grid-template-columns:minmax(200px,32%) minmax(0,1fr)!important;min-height:178px!important;gap:13px!important;padding:15px 0!important}
#content .okla-warranty-feature{flex-basis:calc((100% - 28px)/3)!important;min-height:139px!important;max-height:139px!important;padding:13px 7px!important}
#content .okla-warranty-feature svg{width:32px!important;height:32px!important;flex-basis:32px!important}
#content .okla-warranty-feature strong{font-size:13px!important}
#content .okla-warranty-copy strong{font-size:22px!important}
#content .okla-warranty-copy .okla-warranty-subtitle{font-size:17px!important}
}
@media(max-width:767px){
#content .okla-warranty-strip{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:15px!important;min-height:0!important;padding:17px 0!important;margin:22px 0 26px!important}
#content .okla-warranty-intro{gap:10px!important;padding:0 11px!important}
#content .okla-warranty-copy strong{font-size:22px!important}
#content .okla-warranty-copy .okla-warranty-subtitle{font-size:17px!important}
#content .okla-warranty-more{height:38px!important;min-height:38px!important}
#content .okla-warranty-carousel{padding:0!important}
#content .okla-warranty-feature{flex-basis:calc((100% - 12px)/2)!important;min-height:140px!important;max-height:140px!important;padding:13px 8px!important;gap:7px!important}
#content .okla-warranty-feature svg{height:33px!important;width:33px!important;flex-basis:33px!important}
#content .okla-warranty-feature strong{font-size:14px!important}
#content .okla-warranty-feature small{font-size:11px!important}
#content .okla-warranty-arrow{height:64px!important;width:30px!important}
}
/* OKLA V35: enforce exact edge-to-edge warranty panel in Shoptet 20px content gutters, flat-left CTA. */
@media(min-width:768px){
#content .okla-warranty-strip{margin-left:-20px!important;margin-right:-20px!important;width:calc(100% + 40px)!important;max-width:none!important;padding-left:0!important;padding-right:0!important;overflow:hidden!important}
#content .okla-warranty-intro{padding-left:0!important;margin-left:0!important;align-items:flex-start!important}
#content .okla-warranty-more{display:inline-flex!important;align-self:flex-start!important;justify-self:start!important;margin-left:0!important;transform:none!important}
}
@media(max-width:767px){
#content .okla-warranty-strip{margin-left:-15px!important;margin-right:-15px!important;width:calc(100% + 30px)!important;max-width:none!important}
#content .okla-warranty-intro{padding-left:0!important;margin-left:0!important}
#content .okla-warranty-more{margin-left:0!important}
}
/* OKLA V36 – fully padded, premium two-year warranty band inspired by the visual layout, not Alza brands. */
#content .okla-warranty-strip{display:grid!important;grid-template-columns:minmax(246px,30%) minmax(0,1fr)!important;align-items:center!important;gap:15px!important;box-sizing:border-box!important;min-height:218px!important;max-width:none!important;margin-top:30px!important;margin-bottom:34px!important;padding:24px 0!important;border:0!important;border-radius:0!important;overflow:hidden!important;background:#eef3fd!important;background-image:linear-gradient(98deg,#eff5fe 0%,#edf3fd 62%,#edf2fc 100%)!important}
#content .okla-warranty-intro{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:13px!important;min-height:0!important;min-width:0!important;margin:0!important;padding:0 12px 0 27px!important;text-align:left!important}
#content .okla-warranty-copy{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:3px!important;text-align:left!important}
#content .okla-warranty-copy strong{font-size:clamp(22px,1.9vw,27px)!important;line-height:1.15!important;font-weight:800!important;letter-spacing:-.3px!important;color:#071b38!important}
#content .okla-warranty-copy .okla-warranty-subtitle{font-size:clamp(17px,1.43vw,20px)!important;line-height:1.24!important;font-weight:700!important;color:#081f3f!important}
#content .okla-warranty-copy .okla-warranty-legal{max-width:225px!important;font-size:10.5px!important;line-height:1.4!important;color:#586a85!important;margin-top:5px!important}
#content .okla-warranty-more{display:inline-flex!important;align-self:flex-start!important;justify-self:start!important;flex:0 0 auto!important;gap:4px!important;min-width:0!important;max-width:100%!important;width:auto!important;height:39px!important;min-height:39px!important;margin:2px 0 0 0!important;padding:0 17px!important;border:0!important;border-radius:5px!important;background:#164b9e!important;color:#fff!important;font-size:13px!important;font-weight:700!important;text-decoration:none!important;box-shadow:none!important}
#content .okla-warranty-more:hover,#content .okla-warranty-more:active,#content .okla-warranty-more:focus{background:#164b9e!important;color:#fff!important;text-decoration:none!important;box-shadow:none!important}
#content .okla-warranty-carousel{display:block!important;position:relative!important;width:100%!important;max-width:100%!important;min-width:0!important;padding:0!important;overflow:hidden!important}
#content .okla-warranty-cards{display:flex!important;align-items:stretch!important;justify-content:flex-start!important;flex-wrap:nowrap!important;gap:11px!important;box-sizing:border-box!important;position:relative!important;width:calc(100% - 42px)!important;min-width:0!important;height:164px!important;margin:0!important;padding:0!important;overflow:visible!important;scroll-behavior:auto!important;scroll-snap-type:none!important;scrollbar-width:none!important;will-change:transform!important}
#content .okla-warranty-feature{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;flex:0 0 calc((100% - 33px)/4)!important;min-width:0!important;max-width:none!important;min-height:161px!important;max-height:161px!important;height:161px!important;gap:8px!important;margin:0!important;padding:12px 7px!important;border:1px solid #dfe6f1!important;border-radius:9px!important;background:#fff!important;box-shadow:0 1px 4px rgba(14,41,84,.11)!important;box-sizing:border-box!important;text-align:center!important;scroll-snap-align:none!important}
#content .okla-warranty-icon{display:grid!important;place-items:center!important;flex:0 0 54px!important;width:54px!important;height:54px!important;border-radius:14px!important;margin:0!important;box-sizing:border-box!important;background:#ebf4ff!important}
#content .okla-warranty-icon svg{display:block!important;width:37px!important;height:37px!important;min-width:37px!important;flex:0 0 37px!important;overflow:visible!important;fill:none!important;stroke-width:0!important}
#content .okla-warranty-feature[data-tone="indigo"] .okla-warranty-icon{background:#eef0ff!important}
#content .okla-warranty-feature[data-tone="green"] .okla-warranty-icon{background:#e9f8ee!important}
#content .okla-warranty-feature[data-tone="orange"] .okla-warranty-icon{background:#fff2e5!important}
#content .okla-warranty-feature[data-tone="violet"] .okla-warranty-icon{background:#f3edff!important}
#content .okla-warranty-feature strong{display:block!important;font-size:14px!important;font-weight:750!important;line-height:1.2!important;color:#112f68!important;white-space:normal!important}
#content .okla-warranty-feature small{display:block!important;font-size:11px!important;font-weight:400!important;line-height:1.32!important;color:#52627d!important;white-space:normal!important}
#content .okla-warranty-arrow{display:grid!important;place-items:center!important;position:absolute!important;right:0!important;top:50%!important;z-index:5!important;width:34px!important;height:74px!important;margin:0!important;padding:0!important;border:0!important;border-radius:5px 0 0 5px!important;background:#174793!important;box-shadow:none!important;color:#fff!important;transform:translateY(-50%)!important;cursor:pointer!important}
#content .okla-warranty-arrow svg{width:18px!important;height:18px!important;stroke:#fff!important;stroke-width:2.8!important;fill:none!important}
#content .okla-warranty-arrow:hover,#content .okla-warranty-arrow:active,#content .okla-warranty-arrow:focus{background:#174793!important;box-shadow:none!important;color:#fff!important}
@media(min-width:768px) and (max-width:1199px){
#content .okla-warranty-strip{grid-template-columns:minmax(205px,31%) minmax(0,1fr)!important;gap:10px!important;min-height:202px!important;padding:20px 0!important}
#content .okla-warranty-intro{padding-left:22px!important;gap:10px!important}
#content .okla-warranty-copy strong{font-size:22px!important}
#content .okla-warranty-copy .okla-warranty-subtitle{font-size:16px!important}
#content .okla-warranty-feature{flex-basis:calc((100% - 22px)/3)!important}
}
@media(max-width:767px){
#content .okla-warranty-strip{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:17px!important;min-height:0!important;padding:20px 0!important;margin:24px 0 27px!important}
#content .okla-warranty-intro{padding:0 20px!important;gap:9px!important}
#content .okla-warranty-copy strong{font-size:22px!important}
#content .okla-warranty-copy .okla-warranty-subtitle{font-size:16px!important}
#content .okla-warranty-more{height:38px!important;min-height:38px!important}
#content .okla-warranty-carousel{width:100%!important}
#content .okla-warranty-cards{width:calc(100% - 35px)!important;height:147px!important;gap:9px!important}
#content .okla-warranty-feature{flex:0 0 calc((100% - 9px)/2)!important;height:145px!important;min-height:145px!important;max-height:145px!important;padding:9px 5px!important}
#content .okla-warranty-icon{width:47px!important;height:47px!important;flex-basis:47px!important;border-radius:12px!important}
#content .okla-warranty-icon svg{width:32px!important;height:32px!important;min-width:32px!important}
#content .okla-warranty-feature strong{font-size:12px!important}
#content .okla-warranty-feature small{font-size:10px!important}
#content .okla-warranty-arrow{width:30px!important;height:62px!important}
}
/* OKLA V37 — authentic transparent PNG icons, no background badge, wide landscape warranty tiles. */
@media(min-width:1200px){
#content .okla-warranty-strip{grid-template-columns:minmax(235px,27%) minmax(0,1fr)!important;min-height:169px!important;padding:14px 0!important;gap:15px!important}
#content .okla-warranty-cards{height:122px!important;gap:11px!important}
#content .okla-warranty-feature{flex:0 0 calc((100% - 22px)/3)!important;width:calc((100% - 22px)/3)!important;height:119px!important;min-height:119px!important;max-height:119px!important}
}
#content .okla-warranty-strip{align-items:center!important}
#content .okla-warranty-feature{display:flex!important;flex-direction:row!important;justify-content:flex-start!important;align-items:center!important;gap:8px!important;text-align:left!important;padding:11px!important;overflow:hidden!important;border-radius:8px!important}
#content .okla-warranty-icon{display:flex!important;align-items:center!important;justify-content:center!important;flex:0 0 59px!important;width:59px!important;height:67px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
#content .okla-warranty-feature[data-tone] .okla-warranty-icon{background:transparent!important}
#content .okla-warranty-png{display:block!important;width:58px!important;height:58px!important;min-width:58px!important;max-width:58px!important;object-fit:contain!important;image-rendering:auto!important;filter:none!important;background:transparent!important}
#content .okla-warranty-card-copy{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:5px!important;min-width:0!important;max-width:100%!important;flex:1 1 0!important;text-align:left!important}
#content .okla-warranty-card-copy strong{display:block!important;margin:0!important;font-size:13.5px!important;line-height:1.22!important;font-weight:750!important;color:#113a72!important;white-space:normal!important}
#content .okla-warranty-card-copy small{display:block!important;margin:0!important;font-size:11.5px!important;line-height:1.28!important;color:#627084!important;white-space:normal!important}
@media(min-width:768px) and (max-width:1199px){
#content .okla-warranty-strip{min-height:159px!important;padding:14px 0!important}
#content .okla-warranty-cards{height:118px!important}
#content .okla-warranty-feature{flex:0 0 calc((100% - 11px)/2)!important;width:calc((100% - 11px)/2)!important;height:115px!important;min-height:115px!important;max-height:115px!important}
#content .okla-warranty-icon{flex-basis:53px!important;width:53px!important}
#content .okla-warranty-png{width:52px!important;height:52px!important;min-width:52px!important;max-width:52px!important}
}
@media(max-width:767px){
#content .okla-warranty-strip{min-height:0!important;padding:19px 0!important}
#content .okla-warranty-cards{height:116px!important}
#content .okla-warranty-feature{flex:0 0 85%!important;width:85%!important;height:113px!important;min-height:113px!important;max-height:113px!important;padding:10px 12px!important}
#content .okla-warranty-icon{flex-basis:61px!important;width:61px!important;height:62px!important}
#content .okla-warranty-png{width:58px!important;height:58px!important}
}
/* V40: single measured horizontal header in place of conflicting Shoptet item styles */
@media(min-width:992px){
body #header .header-top>.navigation-buttons.okla-header-ready{display:flex!important;align-items:center!important;justify-content:flex-end!important;width:100%!important;min-width:0!important;max-width:370px!important;height:54px!important;gap:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
body #header .navigation-buttons .okla-exact-header{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-start!important;gap:0!important;flex:0 0 340px!important;width:340px!important;min-width:340px!important;max-width:340px!important;height:54px!important;padding:0!important;margin:0!important;position:relative!important;overflow:visible!important;background:transparent!important;box-shadow:none!important}
body #header .navigation-buttons .okla-exact-header>*{all:unset!important;box-sizing:border-box!important;position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;flex-shrink:0!important;height:36px!important;min-height:36px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;background-image:none!important;box-shadow:none!important;transform:none!important;filter:none!important;transition:none!important;color:#072d61!important;cursor:pointer!important;text-decoration:none!important}
body #header .navigation-buttons .okla-exact-header>*:hover,body #header .navigation-buttons .okla-exact-header>*:active,body #header .navigation-buttons .okla-exact-header>*:focus{background:transparent!important;background-image:none!important;box-shadow:none!important;filter:none!important;transform:none!important;color:#072d61!important;text-decoration:none!important}
body #header .navigation-buttons .okla-exact-header>*::before,body #header .navigation-buttons .okla-exact-header>*::after{content:none!important;display:none!important;background:none!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-account{flex:0 0 156px!important;width:156px!important;min-width:156px!important;max-width:156px!important;height:49px!important;justify-content:flex-start!important;gap:9px!important}
body #header .navigation-buttons .okla-exact-header .okla-header-icon{display:grid!important;place-items:center!important;flex:0 0 31px!important;width:31px!important;height:31px!important;min-width:31px!important;min-height:31px!important;border-radius:50%!important;background:#e9edf2!important;box-shadow:none!important}
body #header .navigation-buttons .okla-exact-header .okla-header-icon svg{width:19px!important;height:19px!important;fill:#073366!important;stroke:none!important}
body #header .navigation-buttons .okla-exact-header .okla-header-copy{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:2px!important;min-width:0!important}
body #header .navigation-buttons .okla-exact-header .okla-header-copy strong{font:700 13px/16px Arial,sans-serif!important;color:#082d5d!important;white-space:nowrap!important}
body #header .navigation-buttons .okla-exact-header .okla-header-copy small{font:400 11px/14px Arial,sans-serif!important;color:#133e75!important;white-space:nowrap!important}
body #header .navigation-buttons .okla-exact-header .okla-header-chevron{width:8px!important;height:8px!important;flex:0 0 8px!important;display:block!important;border:0!important;border-right:1.5px solid #9ba3ae!important;border-bottom:1.5px solid #9ba3ae!important;background:transparent!important;transform:rotate(45deg)!important;margin:-4px 0 0 4px!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-orders,body #header .navigation-buttons .okla-exact-header>.okla-header-favorites,body #header .navigation-buttons .okla-exact-header>.okla-header-locale{display:flex!important;align-items:center!important;justify-content:center!important;flex:0 0 45px!important;width:45px!important;min-width:45px!important;max-width:45px!important;height:36px!important;min-height:36px!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-orders{border-left:1px solid #dfe3e8!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-orders svg{display:block!important;width:21px!important;height:23px!important;flex:0 0 21px!important;fill:#063068!important;stroke:none!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-orders svg path.okla-bag-body{fill:#063068!important;stroke:none!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-orders svg path.okla-bag-check{fill:none!important;stroke:#fff!important;stroke-width:1.7!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-favorites svg{display:block!important;width:24px!important;height:24px!important;fill:#062d63!important;stroke:none!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-favorites svg path{fill:#062d63!important;stroke:none!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-locale{cursor:default!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-locale svg{display:block!important;width:29px!important;height:29px!important;border:0!important;border-radius:50%!important;box-shadow:0 0 0 1px #e1e7ef!important}
body #header .navigation-buttons .okla-exact-header>a.cart-count{display:flex!important;align-items:center!important;justify-content:center!important;flex:0 0 49px!important;width:49px!important;min-width:49px!important;max-width:49px!important;height:36px!important;min-height:36px!important;border-left:1px solid #dfe3e8!important;padding:0!important;margin:0!important;background:transparent!important;background-image:none!important;box-shadow:none!important}
body #header .navigation-buttons .okla-exact-header>a.cart-count>*:not(.okla-cart-symbol){display:none!important;visibility:hidden!important}
body #header .navigation-buttons .okla-exact-header>a.cart-count .okla-cart-symbol{all:unset!important;display:flex!important;align-items:center!important;justify-content:center!important;width:30px!important;height:30px!important;color:#999da4!important}
body #header .navigation-buttons .okla-exact-header>a.cart-count .okla-cart-symbol svg{display:block!important;width:28px!important;height:28px!important;stroke:#a0a2a6!important;fill:none!important;stroke-width:1.75!important}
body #header .navigation-buttons .okla-exact-header>a.cart-count .okla-cart-symbol svg path{stroke:#a0a2a6!important;fill:none!important}
body #header .navigation-buttons .okla-exact-header>*:focus-visible{outline:2px solid #007dc3!important;outline-offset:3px!important}
}
@media(min-width:992px) and (max-width:1199px){
body #header .header-top{grid-template-columns:minmax(145px,.7fr) minmax(290px,1.15fr) minmax(337px,1.15fr)!important;gap:10px!important}
body #header .navigation-buttons .okla-exact-header{width:332px!important;min-width:332px!important;flex-basis:332px!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-account{flex-basis:148px!important;width:148px!important;min-width:148px!important;max-width:148px!important;gap:7px!important}
}
@media(max-width:991px){body #header .navigation-buttons .okla-exact-header{display:none!important}}
#content .okla-warranty-icon,#content .okla-warranty-feature[data-tone] .okla-warranty-icon{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important}
#content img.okla-warranty-png{display:block!important;width:60px!important;height:60px!important;min-width:60px!important;max-width:60px!important;object-fit:contain!important;background:transparent!important;filter:none!important}
/* OKLA V41: permanent two 1px separators immune to Shoptet button border resets. */
@media(min-width:992px){
body #header .navigation-buttons .okla-exact-header{width:342px!important;min-width:342px!important;max-width:342px!important;flex-basis:342px!important}
body #header .navigation-buttons .okla-exact-header>.okla-exact-separator{all:unset!important;display:block!important;position:relative!important;box-sizing:border-box!important;flex:0 0 1px!important;width:1px!important;min-width:1px!important;max-width:1px!important;height:23px!important;min-height:23px!important;max-height:23px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:#d3d8e0!important;background-color:#d3d8e0!important;box-shadow:none!important;opacity:1!important;pointer-events:none!important;cursor:default!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-orders,body #header .navigation-buttons .okla-exact-header>a.cart-count{border-left:0!important}
}
@media(min-width:992px) and (max-width:1199px){
body #header .navigation-buttons .okla-exact-header{width:334px!important;min-width:334px!important;max-width:334px!important;flex-basis:334px!important}
}
/* OKLA V42: uniform Alza-like proportions across all right-side icon cells. */
@media(min-width:992px){
body #header .navigation-buttons .okla-exact-header{display:flex!important;align-items:center!important;justify-content:flex-start!important;width:342px!important;min-width:342px!important;max-width:342px!important;flex-basis:342px!important;height:54px!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-account{width:156px!important;min-width:156px!important;max-width:156px!important;flex:0 0 156px!important;height:46px!important;min-height:46px!important;align-self:center!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-orders,
body #header .navigation-buttons .okla-exact-header>.okla-header-favorites,
body #header .navigation-buttons .okla-exact-header>.okla-header-locale,
body #header .navigation-buttons .okla-exact-header>a.cart-count{position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;align-self:center!important;flex:0 0 46px!important;width:46px!important;min-width:46px!important;max-width:46px!important;height:42px!important;min-height:42px!important;max-height:42px!important;margin:0!important;padding:0!important;box-sizing:border-box!important;border:0!important;border-radius:0!important;background:transparent!important;background-image:none!important;box-shadow:none!important;filter:none!important;transform:none!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-orders svg{display:block!important;width:26px!important;min-width:26px!important;height:26px!important;min-height:26px!important;max-height:26px!important;flex:0 0 26px!important;margin:0!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-favorites svg{display:block!important;width:26px!important;min-width:26px!important;height:26px!important;min-height:26px!important;max-height:26px!important;flex:0 0 26px!important;margin:0!important}
body #header .navigation-buttons .okla-exact-header>.okla-header-locale svg{display:block!important;width:28px!important;min-width:28px!important;height:28px!important;min-height:28px!important;max-height:28px!important;flex:0 0 28px!important;margin:0!important;border-radius:50%!important}
body #header .navigation-buttons .okla-exact-header>a.cart-count .okla-cart-symbol{all:unset!important;display:flex!important;align-items:center!important;justify-content:center!important;flex:0 0 30px!important;width:30px!important;min-width:30px!important;height:30px!important;margin:0!important}
body #header .navigation-buttons .okla-exact-header>a.cart-count .okla-cart-symbol svg{width:29px!important;height:29px!important;min-width:29px!important;min-height:29px!important;max-height:29px!important;stroke:#a0a2a6!important;fill:none!important}
body #header .navigation-buttons .okla-exact-header>.okla-exact-separator{display:block!important;flex:0 0 1px!important;width:1px!important;min-width:1px!important;height:26px!important;min-height:26px!important;max-height:26px!important;align-self:center!important;background:#d3d8e0!important;opacity:1!important}
}
@media(min-width:992px) and (max-width:1199px){body #header .navigation-buttons .okla-exact-header{width:334px!important;min-width:334px!important;max-width:334px!important;flex-basis:334px!important}body #header .navigation-buttons .okla-exact-header>.okla-header-account{flex:0 0 148px!important;width:148px!important;min-width:148px!important;max-width:148px!important}}
/* Warranty support icon: embedded generated PNG, no external request, visible at large size. */
#content .okla-warranty-feature[data-tone="orange"] .okla-warranty-icon{display:flex!important;align-items:center!important;justify-content:center!important;width:72px!important;min-width:72px!important;flex-basis:72px!important;height:78px!important;min-height:78px!important;background:transparent!important;visibility:visible!important;opacity:1!important;filter:none!important}
#content .okla-warranty-feature[data-tone="orange"] img.okla-warranty-png{display:block!important;width:72px!important;height:72px!important;min-width:72px!important;max-width:72px!important;max-height:72px!important;object-fit:contain!important;visibility:visible!important;opacity:1!important;filter:none!important;mix-blend-mode:normal!important}
@media(max-width:767px){#content .okla-warranty-feature[data-tone="orange"] img.okla-warranty-png{width:64px!important;height:64px!important;min-width:64px!important}}

/* OKLA V44 — only H1 on left; exactly identical image and icon-container dimensions on all five warranty tiles. */
#content .okla-warranty-intro{display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:flex-start!important;gap:0!important;padding:0 12px 0 27px!important}
#content .okla-warranty-copy{display:block!important;min-width:0!important;margin:0!important;padding:0!important}
#content .okla-warranty-copy .okla-warranty-heading{display:block!important;width:auto!important;max-width:100%!important;height:auto!important;margin:0!important;padding:0!important;border:0!important;color:#071b38!important;font-family:'Roboto',Arial,sans-serif!important;font-size:clamp(22px,1.9vw,27px)!important;line-height:1.15!important;font-weight:800!important;letter-spacing:-.3px!important;text-transform:none!important;text-align:left!important}
#content .okla-warranty-copy .okla-warranty-subtitle,#content .okla-warranty-copy .okla-warranty-legal,#content .okla-warranty-intro .okla-warranty-more{display:none!important}
#content .okla-warranty-feature .okla-warranty-icon,#content .okla-warranty-feature[data-tone] .okla-warranty-icon{display:flex!important;justify-content:center!important;align-items:center!important;flex:0 0 66px!important;width:66px!important;min-width:66px!important;max-width:66px!important;height:66px!important;min-height:66px!important;max-height:66px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;opacity:1!important;visibility:visible!important;filter:none!important}
#content .okla-warranty-feature img.okla-warranty-png,#content .okla-warranty-feature[data-tone] img.okla-warranty-png{display:block!important;position:static!important;flex:0 0 62px!important;width:62px!important;min-width:62px!important;max-width:62px!important;height:62px!important;min-height:62px!important;max-height:62px!important;margin:0!important;padding:0!important;object-fit:contain!important;object-position:center center!important;opacity:1!important;visibility:visible!important;mix-blend-mode:normal!important;filter:none!important;transform:none!important;background:transparent!important}
@media(max-width:767px){#content .okla-warranty-intro{padding-left:20px!important}#content .okla-warranty-copy .okla-warranty-heading{font-size:22px!important}#content .okla-warranty-feature .okla-warranty-icon,#content .okla-warranty-feature[data-tone] .okla-warranty-icon{flex-basis:60px!important;width:60px!important;min-width:60px!important;max-width:60px!important;height:60px!important;min-height:60px!important;max-height:60px!important}#content .okla-warranty-feature img.okla-warranty-png,#content .okla-warranty-feature[data-tone] img.okla-warranty-png{flex-basis:56px!important;width:56px!important;min-width:56px!important;max-width:56px!important;height:56px!important;min-height:56px!important;max-height:56px!important}}


/* OKLA V45 center H1; compact cards, dedicated arrow column; prevent cropping/overlap. */
#content .okla-warranty-intro{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;text-align:center!important;min-width:0!important;margin:0!important;padding:0 16px!important}
#content .okla-warranty-copy{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;margin:0!important;padding:0!important;text-align:center!important}
#content .okla-warranty-copy .okla-warranty-heading{display:block!important;margin:0!important;padding:0!important;font-size:clamp(22px,1.9vw,27px)!important;line-height:1.15!important;font-weight:800!important;text-align:center!important}
#content .okla-warranty-carousel{display:grid!important;position:relative!important;grid-template-columns:minmax(0,1fr) 40px!important;align-items:center!important;gap:10px!important;width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;padding:0 13px 0 0!important;overflow:visible!important;box-sizing:border-box!important}
#content .okla-warranty-viewport{position:relative!important;display:block!important;width:100%!important;min-width:0!important;max-width:100%!important;height:120px!important;margin:0!important;padding:0!important;overflow:hidden!important;box-sizing:border-box!important;border-radius:8px!important}
#content .okla-warranty-cards{display:flex!important;align-items:stretch!important;flex-wrap:nowrap!important;gap:11px!important;position:relative!important;width:100%!important;min-width:0!important;height:120px!important;margin:0!important;padding:0!important;overflow:visible!important;box-sizing:border-box!important}
#content .okla-warranty-feature{display:flex!important;flex:0 0 calc((100% - 22px)/3)!important;width:calc((100% - 22px)/3)!important;min-width:0!important;max-width:none!important;height:118px!important;min-height:118px!important;max-height:118px!important;margin:0!important;padding:10px 11px!important;gap:8px!important;box-sizing:border-box!important}
#content .okla-warranty-arrow{display:grid!important;position:relative!important;top:auto!important;right:auto!important;bottom:auto!important;left:auto!important;z-index:2!important;place-items:center!important;justify-self:center!important;align-self:center!important;width:38px!important;min-width:38px!important;max-width:38px!important;height:68px!important;min-height:68px!important;margin:0!important;padding:0!important;border:0!important;border-radius:6px!important;background:#174793!important;color:#fff!important;box-shadow:none!important;transform:none!important;cursor:pointer!important}
#content .okla-warranty-arrow svg{display:block!important;width:18px!important;height:18px!important;stroke:#fff!important;stroke-width:2.8!important;fill:none!important;opacity:1!important;visibility:visible!important}
#content .okla-slider-controls .okla-slider-prev svg,#content .okla-slider-controls .okla-slider-next svg{display:block!important;width:21px!important;height:21px!important;stroke:#fff!important;stroke-width:2.6!important;fill:none!important;opacity:1!important;visibility:visible!important}
@media(min-width:1200px){#content .okla-warranty-strip{display:grid!important;grid-template-columns:minmax(265px,32%) minmax(0,1fr)!important;align-items:center!important;gap:12px!important;min-height:168px!important;padding:18px 0!important}}
@media(min-width:768px) and (max-width:1199px){#content .okla-warranty-strip{display:grid!important;grid-template-columns:minmax(205px,31%) minmax(0,1fr)!important;gap:10px!important;min-height:158px!important;padding:15px 0!important}#content .okla-warranty-carousel{grid-template-columns:minmax(0,1fr) 36px!important;gap:8px!important;padding-right:10px!important}#content .okla-warranty-viewport,#content .okla-warranty-cards{height:117px!important}#content .okla-warranty-feature{flex:0 0 calc((100% - 11px)/2)!important;width:calc((100% - 11px)/2)!important;height:115px!important;min-height:115px!important;max-height:115px!important;padding:9px!important}#content .okla-warranty-arrow{width:34px!important;min-width:34px!important;max-width:34px!important;height:64px!important}}
@media(max-width:767px){#content .okla-warranty-strip{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:14px!important;padding:19px 0!important}#content .okla-warranty-intro{align-items:center!important;justify-content:center!important;padding:0 16px!important}#content .okla-warranty-copy .okla-warranty-heading{font-size:22px!important}#content .okla-warranty-carousel{grid-template-columns:minmax(0,1fr) 35px!important;gap:8px!important;padding:0 12px!important}#content .okla-warranty-viewport,#content .okla-warranty-cards{height:116px!important}#content .okla-warranty-feature{flex:0 0 100%!important;width:100%!important;height:113px!important;min-height:113px!important;max-height:113px!important;padding:10px 12px!important}#content .okla-warranty-arrow{width:34px!important;min-width:34px!important;max-width:34px!important;height:62px!important}}


/* OKLA V46: restore original supporting warranty copy, aligned within the left text column. */
#content .okla-warranty-strip{min-height:184px!important}
#content .okla-warranty-intro{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:10px!important;text-align:center!important;min-height:0!important;padding:10px 18px!important}
#content .okla-warranty-copy{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:5px!important;text-align:center!important}
#content .okla-warranty-copy .okla-warranty-heading{font-size:clamp(22px,1.9vw,27px)!important;line-height:1.15!important;text-align:center!important}
#content .okla-warranty-copy .okla-warranty-subtitle{display:block!important;font-size:15px!important;line-height:1.3!important;font-weight:600!important;color:#20446f!important;text-align:center!important}
#content .okla-warranty-copy .okla-warranty-legal{display:block!important;max-width:290px!important;font-size:11px!important;line-height:1.38!important;color:#5a6e85!important;text-align:center!important}
#content .okla-warranty-intro .okla-warranty-more{display:inline-flex!important;align-items:center!important;justify-content:center!important;align-self:center!important;height:30px!important;min-height:30px!important;min-width:0!important;margin:0!important;padding:0 12px!important;border:1px solid #b9d2f1!important;border-radius:5px!important;background:#fff!important;color:#164b9e!important;font-size:12px!important;font-weight:700!important;line-height:1.2!important;text-decoration:none!important;box-shadow:none!important}
#content .okla-warranty-intro .okla-warranty-more:hover{background:#e6f0fc!important;text-decoration:none!important}
#content .homepage-group-title.okla-slider-heading{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:14px!important;width:100%!important;min-width:0!important}
#content .homepage-group-title.okla-slider-heading .okla-section-more{display:inline-flex!important;flex:0 0 auto!important;align-items:center!important;justify-content:flex-end!important;gap:6px!important;margin-left:auto!important;padding:4px 0 4px 12px!important;border:0!important;border-radius:0!important;background:transparent!important;color:#0d57a3!important;font:600 14px/20px Roboto,'Segoe UI',Arial,sans-serif!important;letter-spacing:0!important;text-align:right!important;text-decoration:none!important;white-space:nowrap!important;box-shadow:none!important;transition:color .15s ease!important}
#content .homepage-group-title.okla-slider-heading .okla-section-more:hover{color:#092e70!important;text-decoration:underline!important}
#content .homepage-group-title.okla-slider-heading .okla-section-more svg{display:block!important;width:15px!important;height:15px!important;min-width:15px!important;stroke:currentColor!important;stroke-width:2!important;stroke-linecap:round!important;stroke-linejoin:round!important;fill:none!important}
#content .homepage-group-title.okla-slider-heading .okla-section-more:focus-visible{outline:2px solid #174793!important;outline-offset:4px!important}
#content .product .okla-fav-toggle,#content .products .okla-fav-toggle{display:none!important;visibility:hidden!important}
body.type-detail #content .okla-detail-favorite{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;width:auto!important;min-height:34px!important;margin:12px 0 0!important;padding:7px 12px!important;background:#fff!important;color:#174793!important;border:1px solid #c4d3e7!important;border-radius:6px!important;box-shadow:none!important;font-size:12px!important;font-weight:600!important;cursor:pointer!important}
body.type-detail #content .okla-detail-favorite svg{display:block!important;width:17px!important;height:17px!important;stroke:#174793!important;stroke-width:1.8!important;fill:none!important}
body.type-detail #content .okla-detail-favorite.is-active svg{fill:#174793!important}
@media(min-width:768px) and (max-width:1199px){#content .okla-warranty-intro{gap:6px!important;padding:8px 12px!important}#content .okla-warranty-copy .okla-warranty-legal{font-size:10px!important}}
@media(max-width:767px){#content .okla-warranty-strip{min-height:0!important}#content .okla-warranty-intro{padding:6px 20px!important;gap:8px!important}#content .okla-warranty-copy .okla-warranty-heading{font-size:22px!important}#content .okla-warranty-copy .okla-warranty-subtitle{font-size:14px!important}#content .okla-warranty-copy .okla-warranty-legal{font-size:11px!important}#content .homepage-group-title.okla-slider-heading .okla-section-more{font-size:12px!important;gap:3px!important;padding-left:8px!important}#content .homepage-group-title.okla-slider-heading .okla-section-more svg{width:13px!important;height:13px!important;min-width:13px!important}}


/* OKLA V47 — two-line warranty message like the supplied reference; shared type style. */
#content .okla-warranty-strip{min-height:178px!important}
#content .okla-warranty-intro{
 display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;
 gap:0!important;min-width:0!important;min-height:0!important;margin:0!important;padding:14px 18px!important;text-align:left!important;
}
#content .okla-warranty-copy{
 display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;
 width:max-content!important;max-width:100%!important;min-width:0!important;gap:3px!important;margin:0 auto!important;
 padding:0!important;text-align:left!important;
}
#content .okla-warranty-copy .okla-warranty-heading,
#content .okla-warranty-copy .okla-warranty-subtitle{
 display:block!important;position:static!important;align-self:flex-start!important;
 width:auto!important;max-width:100%!important;height:auto!important;min-height:0!important;
 margin:0!important;padding:0!important;
 font-family:Roboto,'Segoe UI',Arial,sans-serif!important;
 font-size:clamp(20px,1.9vw,27px)!important;font-weight:800!important;line-height:1.19!important;
 letter-spacing:-.35px!important;color:#071b38!important;text-align:left!important;text-transform:none!important;
}
#content .okla-warranty-copy .okla-warranty-subtitle{white-space:nowrap!important}
#content .okla-warranty-copy .okla-warranty-legal{display:none!important}
#content .okla-warranty-intro .okla-warranty-more{
 display:inline-flex!important;position:static!important;align-items:center!important;justify-content:center!important;
 align-self:flex-start!important;width:auto!important;max-width:100%!important;min-width:0!important;height:33px!important;min-height:33px!important;
 margin:11px 0 0!important;padding:0 14px!important;background:#194892!important;border:1px solid #194892!important;
 border-radius:7px!important;color:#fff!important;font-family:Roboto,Arial,sans-serif!important;font-size:12px!important;
 font-weight:700!important;line-height:1!important;text-decoration:none!important;box-shadow:none!important;white-space:nowrap!important;
}
#content .okla-warranty-intro .okla-warranty-more:hover,#content .okla-warranty-intro .okla-warranty-more:focus{
 background:#0f3678!important;border-color:#0f3678!important;color:#fff!important;
}
@media(min-width:768px) and (max-width:1199px){
 #content .okla-warranty-intro{padding:12px 10px!important}
 #content .okla-warranty-copy .okla-warranty-heading,#content .okla-warranty-copy .okla-warranty-subtitle{
  font-size:clamp(18px,1.9vw,23px)!important;
 }
}
@media(max-width:767px){
 #content .okla-warranty-strip{min-height:0!important}
 #content .okla-warranty-intro{padding:16px 18px 12px!important}
 #content .okla-warranty-copy .okla-warranty-heading,#content .okla-warranty-copy .okla-warranty-subtitle{
  font-size:clamp(19px,5vw,22px)!important;line-height:1.2!important;
 }
 #content .okla-warranty-intro .okla-warranty-more{height:32px!important;min-height:32px!important;margin-top:10px!important}
}


/* OKLA V48: compact responsive typography without a third wrapped line. CTA stays in the shared text group. */
@media(min-width:768px) and (max-width:1199px){
 #content .okla-warranty-copy .okla-warranty-heading,
 #content .okla-warranty-copy .okla-warranty-subtitle{font-size:clamp(16px,1.95vw,23px)!important}
}


/* OKLA V49: one vertical-center control pair per product slider, consistent Alza-like navigation. */
#content .okla-slider-shell{position:relative!important;isolation:isolate!important}
#content .okla-slider-shell>.okla-slider-controls{
 position:absolute!important;z-index:90!important;top:0!important;bottom:0!important;
 display:flex!important;align-items:center!important;justify-content:space-between!important;
 width:auto!important;height:auto!important;min-height:0!important;transform:none!important;
 margin:0!important;padding:0!important;pointer-events:none!important;
}
#content .okla-slider-shell>.okla-slider-controls>button{
 position:relative!important;top:auto!important;bottom:auto!important;left:auto!important;right:auto!important;
 flex:0 0 34px!important;display:grid!important;place-items:center!important;
 width:34px!important;min-width:34px!important;max-width:34px!important;
 height:64px!important;min-height:64px!important;max-height:64px!important;
 margin:0!important;padding:0!important;border:0!important;background:#174793!important;
 box-shadow:0 1px 4px rgba(16,43,84,.16)!important;pointer-events:auto!important;transform:none!important;
 transition:background-color .15s ease!important;color:#fff!important;
}
#content .okla-slider-shell>.okla-slider-controls>.okla-slider-prev{border-radius:0 6px 6px 0!important}
#content .okla-slider-shell>.okla-slider-controls>.okla-slider-next{border-radius:6px 0 0 6px!important}
#content .okla-slider-shell>.okla-slider-controls>button svg{
 display:block!important;width:20px!important;height:20px!important;stroke:#fff!important;stroke-width:2.5!important;
 stroke-linecap:round!important;stroke-linejoin:round!important;fill:none!important;
}
#content .okla-slider-shell>.okla-slider-controls>button:hover{background:#103977!important}
/* True edge-to-edge band within Shoptet white content wrapper: inline measured geometry in alignWarrantyStrip. */
body.type-index #content-wrapper #content .okla-warranty-strip{
 position:relative!important;display:grid!important;grid-template-columns:minmax(265px,32%) minmax(0,1fr)!important;
 align-items:center!important;gap:12px!important;box-sizing:border-box!important;
 max-width:none!important;margin-top:28px!important;margin-bottom:30px!important;
 padding:18px 0!important;border:0!important;border-radius:0!important;overflow:hidden!important;
 background:#eef3fd!important;background-image:linear-gradient(98deg,#eff5fe 0%,#edf3fd 62%,#edf2fc 100%)!important;
}
#content .okla-warranty-carousel{
 display:grid!important;grid-template-columns:minmax(0,1fr) 34px!important;
 align-items:center!important;gap:11px!important;min-width:0!important;width:100%!important;
 padding:0!important;overflow:visible!important;box-sizing:border-box!important;
}
#content .okla-warranty-viewport{display:block!important;min-width:0!important;max-width:100%!important;width:100%!important;overflow:hidden!important}
#content .okla-warranty-arrow{
 display:grid!important;place-items:center!important;justify-self:end!important;align-self:center!important;
 position:relative!important;top:auto!important;bottom:auto!important;left:auto!important;right:0!important;
 flex:0 0 34px!important;width:34px!important;min-width:34px!important;max-width:34px!important;
 height:64px!important;min-height:64px!important;max-height:64px!important;
 margin:0!important;padding:0!important;border:0!important;border-radius:6px 0 0 6px!important;
 background:#174793!important;transform:none!important;color:#fff!important;box-shadow:0 1px 4px rgba(16,43,84,.16)!important;
}
#content .okla-warranty-arrow svg{display:block!important;width:20px!important;height:20px!important;stroke:#fff!important;stroke-width:2.5!important;fill:none!important}
#content .okla-warranty-arrow:hover{background:#103977!important}
/* Stable product art box, uniform product information and quantity/product-name-safe proportions. */
@media(min-width:992px){
#content .okla-slider-track>.product .p{
 display:flex!important;flex-direction:column!important;align-items:stretch!important;
 height:100%!important;min-width:0!important;box-sizing:border-box!important;
 padding:11px 10px 18px!important;border:1px solid transparent!important;border-radius:9px!important;
 background:#fff!important;box-shadow:none!important;transform:none!important;transition:border-color .18s ease,box-shadow .18s ease!important;
}
#content .okla-slider-track>.product .p>a.image{
 display:flex!important;align-items:center!important;justify-content:center!important;
 height:clamp(172px,14vw,202px)!important;min-height:172px!important;max-height:202px!important;
 width:100%!important;min-width:0!important;max-width:100%!important;margin:0 auto 9px!important;
 padding:5px 8px!important;overflow:hidden!important;background:#fff!important;
}
#content .okla-slider-track>.product .p>a.image img{
 display:block!important;width:100%!important;height:100%!important;
 max-width:100%!important;max-height:100%!important;margin:auto!important;object-fit:contain!important;
 object-position:center center!important;transform:none!important;filter:none!important;
}
#content .okla-slider-track .prices,#content .okla-slider-track .p-tools .btn-cart{
 width:144px!important;max-width:100%!important;margin-left:auto!important;margin-right:auto!important;
}
#content .okla-slider-track .p-tools{margin-top:auto!important;padding-top:15px!important}
}
@media(hover:hover) and (pointer:fine){
#content .okla-slider-track>.product:hover .p,
#content .okla-slider-track>.product .p:hover{
 border-color:#e1e4eb!important;border-radius:9px!important;
 box-shadow:0 3px 14px rgba(18,36,56,.16)!important;transform:none!important;
}
#content .okla-slider-track>.product:hover .p-tools .btn-cart,
#content .okla-slider-track>.product .p:focus-within .p-tools .btn-cart{
 background-color:#dbe5f6!important;border-color:#dbe5f6!important;color:#13417f!important;
 box-shadow:none!important;transform:none!important;
}
}
#content .okla-slider-track .p-tools .btn-cart{
 border-radius:7px!important;transition:background-color .18s ease,border-color .18s ease!important;
}
@media(min-width:768px) and (max-width:991px){
body.type-index #content-wrapper #content .okla-warranty-strip{grid-template-columns:minmax(205px,31%) minmax(0,1fr)!important}
#content .okla-warranty-carousel{grid-template-columns:minmax(0,1fr) 34px!important;gap:8px!important}
}
@media(max-width:767px){
body.type-index #content-wrapper #content .okla-warranty-strip{
 display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:14px!important;padding:18px 0!important;
}
#content .okla-warranty-carousel{grid-template-columns:minmax(0,1fr) 34px!important;gap:8px!important;padding:0!important}
#content .okla-warranty-arrow{width:34px!important;height:64px!important}
#content .okla-slider-track>.product .p>a.image img{transform:none!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important}
#content .okla-slider-shell>.okla-slider-controls{display:none!important}
}


/* OKLA V50 — no sidebar bleed for warranty; full right content column only. */
body.type-index #content-wrapper main#content #okla-warranty-strip{box-sizing:border-box!important;max-width:none!important;position:relative!important}
body.type-index #content-wrapper main#content #okla-warranty-strip .okla-warranty-more{background:#194892!important;color:#fff!important}
/* Product hover is distinct from cart-button hover: move pointer onto button to highlight button. */
@media(hover:hover) and (pointer:fine){
 #content .okla-slider-track>.product:hover .p-tools .btn-cart:not(:hover):not(:focus-visible),
 #content .okla-slider-track>.product .p:focus-within .p-tools .btn-cart:not(:hover):not(:focus-visible),
 #content .okla-slider-track>.product .p-tools .btn-cart:not(:hover):not(:focus-visible){
   background-color:#fff!important;border-color:#cbdcf5!important;color:#16438c!important;
   box-shadow:none!important;filter:none!important;transform:none!important;
 }
 #content .okla-slider-track>.product .p-tools .btn-cart:hover,
 #content .okla-slider-track>.product .p-tools .btn-cart:focus-visible{
   background-color:#dbe5f6!important;border-color:#b5cae8!important;color:#13417f!important;
   box-shadow:none!important;filter:none!important;transform:none!important;
 }
}
/* Four optical 26px icons in equal 46px cells; no duplicate borders or strokes. */
@media(min-width:992px){
 body #header .header-top .navigation-buttons .okla-exact-header{
  display:flex!important;align-items:center!important;justify-content:flex-start!important;
  width:342px!important;min-width:342px!important;max-width:342px!important;flex:0 0 342px!important;
 }
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-orders,
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-favorites,
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-locale,
 body #header .header-top .navigation-buttons .okla-exact-header>a.cart-count{
  position:relative!important;display:grid!important;place-items:center!important;
  flex:0 0 46px!important;width:46px!important;min-width:46px!important;max-width:46px!important;
  height:42px!important;min-height:42px!important;max-height:42px!important;
  align-self:center!important;margin:0!important;padding:0!important;
  border:0!important;border-left:0!important;border-right:0!important;border-top:0!important;border-bottom:0!important;
  outline-offset:2px!important;border-radius:0!important;
  background:transparent!important;box-shadow:none!important;filter:none!important;transform:none!important;
 }
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-orders::before,
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-orders::after,
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-favorites::before,
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-favorites::after,
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-locale::before,
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-locale::after,
 body #header .header-top .navigation-buttons .okla-exact-header>a.cart-count::before,
 body #header .header-top .navigation-buttons .okla-exact-header>a.cart-count::after{
  content:none!important;display:none!important;
 }
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-exact-separator{
  all:unset!important;display:block!important;align-self:center!important;box-sizing:border-box!important;
  flex:0 0 1px!important;width:1px!important;min-width:1px!important;max-width:1px!important;
  height:26px!important;min-height:26px!important;max-height:26px!important;
  margin:0!important;padding:0!important;border:0!important;border-radius:0!important;
  background:#d3d8e0!important;box-shadow:none!important;opacity:1!important;pointer-events:none!important;
 }
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-exact-separator::before,
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-exact-separator::after{content:none!important;display:none!important}
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-orders svg.okla-header-lineicon,
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-favorites svg.okla-header-lineicon,
 body #header .header-top .navigation-buttons .okla-exact-header>a.cart-count .okla-cart-symbol svg.okla-header-lineicon{
  display:block!important;position:static!important;flex:0 0 26px!important;
  width:26px!important;min-width:26px!important;max-width:26px!important;
  height:26px!important;min-height:26px!important;max-height:26px!important;
  margin:0!important;padding:0!important;overflow:visible!important;
  stroke:#123b72!important;stroke-width:1.9!important;stroke-linecap:round!important;stroke-linejoin:round!important;
  fill:none!important;transform:none!important;opacity:1!important;filter:none!important;
 }
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-orders svg.okla-header-lineicon path,
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-favorites svg.okla-header-lineicon path,
 body #header .header-top .navigation-buttons .okla-exact-header>a.cart-count .okla-cart-symbol svg.okla-header-lineicon path{
  stroke:#123b72!important;stroke-width:1.9!important;stroke-linecap:round!important;stroke-linejoin:round!important;
  fill:none!important;filter:none!important;
 }
 body #header .header-top .navigation-buttons .okla-exact-header>a.cart-count .okla-cart-symbol{
  all:unset!important;display:grid!important;place-items:center!important;
  flex:0 0 26px!important;width:26px!important;min-width:26px!important;max-width:26px!important;
  height:26px!important;min-height:26px!important;max-height:26px!important;
  margin:0!important;padding:0!important;color:#123b72!important;
 }
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-locale svg.okla-header-flagicon{
  display:block!important;flex:0 0 26px!important;width:26px!important;min-width:26px!important;
  max-width:26px!important;height:26px!important;min-height:26px!important;max-height:26px!important;
  margin:0!important;padding:0!important;border:1px solid #dce2ea!important;border-radius:50%!important;
  background:transparent!important;box-shadow:none!important;transform:none!important;
 }
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-locale svg.okla-header-flagicon rect,
 body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-locale svg.okla-header-flagicon path{
  stroke:none!important;
 }
}
@media(min-width:992px) and (max-width:1199px){
 body #header .header-top .navigation-buttons .okla-exact-header{
  width:334px!important;min-width:334px!important;max-width:334px!important;flex:0 0 334px!important;
 }
}



/* OKLA V51: eliminate every additional header divider/ring; only the two explicit separators remain. */
@media(min-width:992px){
body #header .header-top .navigation-buttons .okla-exact-header::before,
body #header .header-top .navigation-buttons .okla-exact-header::after{content:none!important;display:none!important}
body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-orders,
body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-favorites,
body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-locale,
body #header .header-top .navigation-buttons .okla-exact-header>a.cart-count{
 border:0!important;border-left:0!important;border-right:0!important;
 box-shadow:none!important;background-image:none!important;
}
body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-locale svg.okla-header-flagicon{
 border:0!important;outline:0!important;box-shadow:none!important;
}
body #header .header-top .navigation-buttons .okla-exact-header>.okla-exact-separator{
 display:block!important;flex:0 0 1px!important;width:1px!important;min-width:1px!important;max-width:1px!important;
 border:0!important;background:#d3d8e0!important;box-shadow:none!important;
}
}



/* OKLA V52: warranty arrow fully inside RIGHT content corridor and exactly two header separators. */
@media(min-width:768px){
body.type-index #content-wrapper main#content #okla-warranty-strip{
 padding-top:18px!important;padding-bottom:18px!important;padding-left:0!important;padding-right:24px!important;
}
#content .okla-warranty-carousel{
 width:100%!important;min-width:0!important;max-width:100%!important;box-sizing:border-box!important;
 grid-template-columns:minmax(0,1fr) 34px!important;column-gap:10px!important;
 margin:0!important;padding:0!important;
}
#content .okla-warranty-arrow{
 right:auto!important;left:auto!important;top:auto!important;bottom:auto!important;
 width:34px!important;min-width:34px!important;max-width:34px!important;height:64px!important;
 min-height:64px!important;justify-self:end!important;align-self:center!important;transform:none!important;
}
}
@media(max-width:767px){
body.type-index #content-wrapper main#content #okla-warranty-strip{padding:18px 12px!important}
#content .okla-warranty-carousel{padding:0!important;grid-template-columns:minmax(0,1fr) 34px!important}
#content .okla-warranty-arrow{right:auto!important;left:auto!important;justify-self:end!important}
}
@media(min-width:992px){
body #header .header-top .navigation-buttons .okla-exact-header,
body #header .header-top .navigation-buttons .okla-exact-header>.okla-header-account{
 border-left:0!important;border-right:0!important;box-shadow:none!important;
}
body #header .header-top .navigation-buttons .okla-exact-header>.okla-exact-separator{
 border:0!important;background:#d3d8e0!important;box-shadow:none!important;
}
}


/* OKLA V53 — no left gutter between the sidebar and warranty band; no right gutter behind the arrow. */
body.type-index #content-wrapper main#content #okla-warranty-strip{
  box-sizing:border-box!important;
  padding-left:0!important;padding-right:0!important;
  border-left:0!important;border-right:0!important;
  border-radius:0!important;max-width:none!important;
}
#content .okla-warranty-carousel{
 display:grid!important;grid-template-columns:minmax(0,1fr) 34px!important;
 column-gap:10px!important;box-sizing:border-box!important;
 width:100%!important;min-width:0!important;max-width:100%!important;
 margin:0!important;padding:0!important;
}
#content .okla-warranty-arrow{
 display:grid!important;place-items:center!important;
 position:relative!important;right:0!important;left:auto!important;
 top:auto!important;bottom:auto!important;align-self:center!important;justify-self:end!important;
 width:34px!important;min-width:34px!important;max-width:34px!important;
 height:64px!important;min-height:64px!important;max-height:64px!important;
 margin:0!important;padding:0!important;border:0!important;border-radius:6px 0 0 6px!important;
 transform:none!important;
}
@media(max-width:767px){
body.type-index #content-wrapper main#content #okla-warranty-strip{padding-left:0!important;padding-right:0!important}
#content .okla-warranty-carousel{padding:0!important}
}

`;
  var style=document.getElementById('okla-zapati-firsthalf-styles');
  if(!style){style=document.createElement('style');style.id='okla-zapati-firsthalf-styles';(document.head||document.documentElement).appendChild(style);}
  style.textContent=css;
  document.documentElement.setAttribute('data-okla-layout','53');
  // Roboto via web font; local system font remains the fallback if it is blocked.
  if(!document.getElementById('okla-roboto-font')){var font=document.createElement('link');font.id='okla-roboto-font';font.rel='stylesheet';font.href='https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700;800&display=swap';(document.head||document.documentElement).appendChild(font);}
  // OKLA V19 native SVG icons – generated from path arrays, never parsed from HTML.
  var svgNS='http://www.w3.org/2000/svg';
  var categoryPaths={
    'elektronicke multitooly':['M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z','M9 9h6v6H9z','M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3'],
    'chytra elektronika':['M3.5 4.5h12v11h-12z','M9.5 15.5v3M6 18.5h7','M18 7.5h3v12h-5v-12h2z','M18 17.5h1'],
    'merici technika a naradi':['M3 6.3a1.7 1.7 0 0 1 1.7-1.7h5A1.7 1.7 0 0 1 11.4 6.3v8a1.7 1.7 0 0 1-1.7 1.7h-5A1.7 1.7 0 0 1 3 14.3Z','M4.8 6.7h4.8v3.6H4.8z','M5.3 12.8h0M7.2 12.8h0M9.1 12.8h0','M6.8 16c0 2.7 0 4.4 4 4.4 4.1 0 5.6-1.8 5.6-5.3V10','M15.6 9.3a1.7 1.7 0 1 0 2.4 2.4 1.7 1.7 0 0 0-2.4-2.4Z','M18.6 8.6l1.5-1.5M19.4 11.4l1.9.4M18.4 12.6l1.2 1.6'],
    'endoskopy a inspekcni kamery':['M4 6h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z','M9.5 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z','m17 10 5-3v10l-5-3'],
    'prakticke vychytavky':['M9 16a6.5 6.5 0 1 1 6 0c-.8.8-1.1 1.2-1.2 2H10.2c-.1-.8-.4-1.2-1.2-2Z','M10 20h4M11 22h2','M9.3 10.5a3 3 0 0 1 2.7-2.8'],
    'designove gadgety':['m12 2 1.9 7.9L22 12l-8.1 2.1L12 22l-2.1-7.9L2 12l7.9-2.1L12 2Z','m19 2 .4 2 1.6.5-1.6.5-.4 2-.5-2-1.5-.5 1.5-.5z'],
    'projektory a obraz':['M4 5.5h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z','M9.5 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z','m17 10 5-2.5v9L17 14']
  };
  function normalize(t){return (t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[,+]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();}
  function insertIcons(){document.querySelectorAll('#categories .topic>a,.box-categories .topic>a').forEach(function(link){var txt=Array.from(link.childNodes).filter(function(n){return n.nodeType===3;}).map(function(n){return n.textContent;}).join(' ');var key=normalize(txt||link.textContent),data=categoryPaths[key];if(!data)return;var prev=link.querySelector('.okla-cat-svg,.okla-category-png,.okla-category-icon-font');if(prev&&prev.querySelector('svg path')){link.classList.add('okla-category-with-icon');return;}if(prev)prev.remove();var wrap=document.createElement('span'),svg=document.createElementNS(svgNS,'svg');wrap.className='okla-cat-svg';wrap.setAttribute('aria-hidden','true');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('focusable','false');data.forEach(function(d){var p=document.createElementNS(svgNS,'path');p.setAttribute('d',d);svg.appendChild(p);});wrap.appendChild(svg);link.prepend(wrap);link.classList.add('okla-category-with-icon');Array.from(link.childNodes).forEach(function(n){if(n.nodeType===3&&n.textContent.trim()){var label=document.createElement('span');label.className='okla-cat-label';label.textContent=n.textContent.trim();link.replaceChild(label,n);}});});}
  // Align each SVG's actual x position to the heading, regardless of Shoptet link padding.
  function alignCategoryIcons(){var sidebar=document.querySelector('#content-wrapper aside.sidebar.sidebar-left');if(!sidebar)return;var heading=sidebar.querySelector('.box-categories .pageElement__heading span')||sidebar.querySelector('.box-categories .pageElement__heading');if(!heading)return;var target=heading.getBoundingClientRect().left;sidebar.querySelectorAll('#categories .topic>a.okla-category-with-icon').forEach(function(link){var icon=link.querySelector('.okla-cat-svg');if(!icon)return;link.style.removeProperty('transform');link.style.removeProperty('width');var original=icon.getBoundingClientRect().left;if(!original)return;var delta=Math.max(-30,Math.min(45,Math.round(target-original)));link.style.setProperty('transform','translate3d('+delta+'px,0,0)','important');if(delta>0)link.style.setProperty('width','calc(100% - '+(14+delta)+'px)','important');var overhang=Math.max(0,Math.round(link.getBoundingClientRect().left-sidebar.getBoundingClientRect().left));link.style.setProperty('--okla-hover-overhang',overhang+'px');});}
  // Draw sidebar background / separators against actual measured boxes, not inner gutters.
  function alignSidebarChrome(){var wrapper=document.getElementById('content-wrapper'),sidebar=wrapper&&wrapper.querySelector('aside.sidebar.sidebar-left'),category=sidebar&&sidebar.querySelector('.box-categories');if(!sidebar||!category)return;var side=sidebar.getBoundingClientRect(),cat=category.getBoundingClientRect(),wrap=wrapper.getBoundingClientRect();if(!side.height||!side.width||!cat.height)return;var zk=parseFloat(getComputedStyle(sidebar).zoom)||1;var h=Math.max(0,Math.ceil((cat.bottom-side.top)/zk));var white=sidebar.querySelector('#okla-sidebar-top-white');if(!white){white=document.createElement('div');white.id='okla-sidebar-top-white';white.setAttribute('aria-hidden','true');sidebar.insertBefore(white,sidebar.firstChild);}white.style.setProperty('height',h+'px','important');var line=sidebar.querySelector('#okla-sidebar-horizontal');if(!line){line=document.createElement('div');line.id='okla-sidebar-horizontal';line.setAttribute('aria-hidden','true');sidebar.appendChild(line);}line.style.setProperty('top',h+'px','important');var vertical=wrapper.querySelector(':scope > #okla-sidebar-vertical');if(!vertical){vertical=document.createElement('div');vertical.id='okla-sidebar-vertical';vertical.setAttribute('aria-hidden','true');wrapper.appendChild(vertical);}vertical.style.setProperty('left',Math.round(side.right-wrap.left-1)+'px','important');}
  function arrangeHomepage(){if(location.pathname!=='/'&&location.pathname!=='')return;var root=document.querySelector('main#content');if(!root)return;var banners=root.querySelector('.banners-row');if(!banners)return;var last=banners;[1,4,2].forEach(function(i){var h=root.querySelector('.homepage-products-heading-'+i),p=root.querySelector('.homepage-products-'+i);if(h&&p){var wrapper=p.closest('.okla-slider-shell');last.after(h,wrapper||p);last=wrapper||p;}});var w=root.querySelector('.homepage-box.welcome-wrapper');if(w){last.after(w);last=w;}var benefit=root.querySelector('.benefitBanner.position--benefitHomepage');if(benefit)root.appendChild(benefit);document.body.classList.add('okla-home-sections');}
  // Dekorativní zlute hvezdy s jasnou informaci Bez hodnoceni; skutecne recenze Shoptetu se nenahrazuji.
  var emptyStars=''+Array(5).fill('').join('')+'Bez hodnocení';
  function decorateCard(card){if(card.dataset.oklaCard==='44')return;var inner=card.querySelector('.p-in-in'),name=inner&&inner.querySelector('a.name'),rating=inner&&inner.querySelector('.ratings-wrapper');if(inner&&name&&rating){var availability=rating.querySelector('.availability');var placeholder=rating.querySelector('.stars-placeholder');if(placeholder&&!rating.querySelector('.stars, [itemprop="ratingValue"],[data-rating]')){placeholder.innerHTML=emptyStars;}rating.classList.add('okla-ratings');inner.insertBefore(rating,name);if(availability)name.after(availability);}card.dataset.oklaCard='44';}
  var sliderInstances=[];

  // V46: visible right-aligned "Více" in each homepage section heading.
  function oklaAddSectionLink(heading,group){
    if(!heading || heading.querySelector('.okla-section-more'))return;
    var firstHeading=heading.querySelector('a:not(.okla-section-more)'),title=(heading.textContent||'').trim();
    var isNews=/novink|nové produkty/i.test(title);
    var isAction=/akční|akce|výprodej|slev/i.test(title);
    var choices=isNews?['Novinky','Nové produkty']:isAction?['Akční zboží','Akce','Výprodej']:title?[title]:[];
    var destination=heading.getAttribute('data-category-url')||group.getAttribute('data-category-url')||(firstHeading&&firstHeading.getAttribute('href'))||'';
    if(!destination || destination==='#'){
      var nav=document.querySelectorAll('#navigation a[href], aside.sidebar a[href], .menu-level-1 a[href], .menu-level-2 a[href]');
      outer: for(var z=0;z<choices.length;z++){for(var n=0;n<nav.length;n++){var text=(nav[n].textContent||'').trim(),href=nav[n].getAttribute('href')||'';if(text.toLocaleLowerCase('cs')===choices[z].toLocaleLowerCase('cs') && href && href!=='#' && !/^javascript:/i.test(href)){destination=href;break outer;}}}
    }
    if(!destination || destination==='#')destination=isNews?'/novinky/':isAction?'/akcni-zbozi/':'/vsechny-produkty/';
    var more=document.createElement('a');more.className='okla-section-more';more.href=destination;
    more.setAttribute('aria-label','Zobrazit kategorii '+(title||'produktů'));
    var label=document.createElement('span');label.textContent='Více';
    more.appendChild(label);more.appendChild(oklaSvg(['m9 5 7 7-7 7']));
    heading.appendChild(more);
  }
  function sliderFor(group,heading){var cards=Array.prototype.slice.call(group.children).filter(function(el){return el.classList.contains('product');});if(!cards.length)return;if(group.classList.contains('okla-slider-track')||group.closest('.okla-slider-shell')||group.dataset.oklaSlider==='53'){heading.classList.add('okla-slider-heading');oklaAddSectionLink(heading,group);return;}cards.forEach(decorateCard);var shell=document.createElement('div');shell.className='okla-slider-shell';var viewport=document.createElement('div');viewport.className='okla-slider-viewport';group.parentNode.insertBefore(shell,group);shell.appendChild(viewport);viewport.appendChild(group);group.classList.add('okla-slider-track');group.dataset.oklaSlider='53';heading.classList.add('okla-slider-heading');oklaAddSectionLink(heading,group);var controls=document.createElement('span');controls.className='okla-slider-controls';var left=document.createElement('button'),right=document.createElement('button');left.type=right.type='button';left.className='okla-slider-prev';right.className='okla-slider-next';left.setAttribute('aria-label','Předchozí produkty');right.setAttribute('aria-label','Další produkty');left.replaceChildren(oklaSvg(['m15 18-6-6 6-6']));right.replaceChildren(oklaSvg(['m9 18 6-6-6-6']));controls.append(left,right);shell.appendChild(controls);var host=group.closest('main#content');
    var s={group:group,viewport:viewport,controls:controls,count:cards.length,visible:1,busy:false,dir:'',timer:null,fallback:null,paused:false,reduced:window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches};sliderInstances.push(s);
    function positionControls(){if(!shell.isConnected||!host||!host.isConnected)return;var h=host.getBoundingClientRect(),r=shell.getBoundingClientRect();if(!h.width||!r.width)return;var l=Math.min(0,Math.round(h.left-r.left)),right=Math.min(0,Math.round(r.right-h.right));controls.style.setProperty('left',l+'px','important');controls.style.setProperty('right',right+'px','important');controls.style.removeProperty('top');controls.style.removeProperty('bottom');controls.style.removeProperty('height');controls.style.removeProperty('width');}
    function size(){if(s.busy)finish();var limit=window.innerWidth>=992?5:window.innerWidth>=768?3:2;var visible=Math.min(limit,Math.max(1,s.count-1));s.visible=visible;var gap=parseFloat(window.getComputedStyle(group).columnGap)||14;group.style.setProperty('--okla-card-width','calc((100% - '+((visible-1)*gap)+'px) / '+visible+')');s.step=0;var first=group.querySelector(':scope > .product');if(first)s.step=first.getBoundingClientRect().width+gap;controls.style.display=s.count<=1?'none':'';positionControls();}
    function finish(){if(!s.busy)return;window.clearTimeout(s.fallback);group.style.transition='none';if(s.dir==='next'&&group.firstElementChild)group.appendChild(group.firstElementChild);group.style.transform='translate3d(0,0,0)';void group.offsetWidth;group.style.transition='';s.busy=false;s.dir='';}
    function move(direction){if(s.busy||s.count<=1)return;size();if(!s.step)return;s.busy=true;s.dir=direction;var duration=s.reduced?0:560;if(direction==='prev'){group.style.transition='none';group.prepend(group.lastElementChild);group.style.transform='translate3d('+(-s.step)+'px,0,0)';void group.offsetWidth;group.style.transition='transform '+duration+'ms cubic-bezier(.22,.61,.36,1)';group.style.transform='translate3d(0,0,0)';}else{group.style.transition='transform '+duration+'ms cubic-bezier(.22,.61,.36,1)';group.style.transform='translate3d('+(-s.step)+'px,0,0)';}s.fallback=window.setTimeout(finish,duration+110);}
    group.addEventListener('transitionend',function(e){if(e.target===group&&e.propertyName==='transform')finish();});left.addEventListener('click',function(){move('prev');});right.addEventListener('click',function(){move('next');});
    viewport.addEventListener('mouseenter',function(){s.paused=true;});viewport.addEventListener('mouseleave',function(){s.paused=false;});viewport.addEventListener('focusin',function(){s.paused=true;});viewport.addEventListener('focusout',function(e){if(!viewport.contains(e.relatedTarget))s.paused=false;});
    var x=0,y=0,swipedAt=0;viewport.addEventListener('touchstart',function(e){if(e.touches.length===1){x=e.touches[0].clientX;y=e.touches[0].clientY;}},{passive:true});viewport.addEventListener('touchend',function(e){if(!e.changedTouches.length)return;var dx=e.changedTouches[0].clientX-x,dy=e.changedTouches[0].clientY-y;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.2){swipedAt=Date.now();move(dx<0?'next':'prev');}},{passive:true});viewport.addEventListener('click',function(e){if(Date.now()-swipedAt<450){e.preventDefault();e.stopPropagation();}else if(!e.target.closest('a,button,input,form'))s.paused=false;},true);
    s.resize=size;size();if(window.ResizeObserver){var ro=new ResizeObserver(function(){window.requestAnimationFrame(positionControls);});ro.observe(viewport);ro.observe(host);}viewport.querySelectorAll('img').forEach(function(im){if(!im.complete)im.addEventListener('load',positionControls,{once:true});});if(!s.reduced&&s.count>1)s.timer=window.setInterval(function(){if(!s.paused&&!s.busy&&!document.hidden)move('next');},4200);}
  window.__oklaSliderFor=sliderFor; /* exposed so the product page uses this same slider; homepage behaviour unchanged */
  function initHomepage(){if(location.pathname!=='/'&&location.pathname!=='')return;arrangeHomepage();var root=document.querySelector('main#content');if(!root)return;[1,4,2].forEach(function(i){var group=root.querySelector('.homepage-products-'+i),heading=root.querySelector('.homepage-products-heading-'+i);if(group&&heading)sliderFor(group,heading);});insertIcons();}
  // V26: preserve native Shoptet login popup, cart count/widget and mobile navigation toggles.
  // V27 – native Shoptet actions, bespoke SVG icons (no icon fonts, no fake features).
  function oklaSvg(paths,view){var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox',view||'0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');paths.forEach(function(d){var p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);svg.appendChild(p);});return svg;}
  function oklaElement(name,cls,label){var el=document.createElement(name);if(cls)el.className=cls;if(label!==undefined)el.textContent=label;return el;}
  // V30: unstyled proxy login button prevents Shoptet top-nav-button hover entirely.
  // V31: exact reference positions, preserving native Shoptet account and cart behavior.
  function oklaSolidSvg(path,kind){var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');var node=document.createElementNS('http://www.w3.org/2000/svg','path');node.setAttribute('d',path);if(kind)node.setAttribute('class',kind);svg.appendChild(node);return svg;}
  function oklaCzechFlag(){var svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),ns='http://www.w3.org/2000/svg';svg.setAttribute('viewBox','0 0 32 32');svg.setAttribute('aria-hidden','true');var defs=document.createElementNS(ns,'defs'),clip=document.createElementNS(ns,'clipPath');clip.setAttribute('id','okla-cz-flag-clip');var clipCircle=document.createElementNS(ns,'circle');clipCircle.setAttribute('cx','16');clipCircle.setAttribute('cy','16');clipCircle.setAttribute('r','15.4');clip.appendChild(clipCircle);defs.appendChild(clip);svg.appendChild(defs);var group=document.createElementNS(ns,'g');group.setAttribute('clip-path','url(#okla-cz-flag-clip)');var bg=document.createElementNS(ns,'rect');bg.setAttribute('width','32');bg.setAttribute('height','32');bg.setAttribute('fill','#fff');group.appendChild(bg);var red=document.createElementNS(ns,'rect');red.setAttribute('y','16');red.setAttribute('width','32');red.setAttribute('height','16');red.setAttribute('fill','#d7142d');group.appendChild(red);var blue=document.createElementNS(ns,'path');blue.setAttribute('d','M0 0 17 16 0 32Z');blue.setAttribute('fill','#0c3174');group.appendChild(blue);svg.appendChild(group);return svg;}
  function updateOklaHeader(){var nav=document.querySelector('#header .header-top>.navigation-buttons'),cart=nav&&nav.querySelector('a.cart-count');if(!nav||!cart)return;if(!nav.querySelector('.okla-header-account')){var account=oklaElement('button','okla-header-account');account.type='button';account.setAttribute('aria-label','Můj účet – přihlásit se');var icon=oklaElement('span','okla-header-icon');icon.appendChild(oklaSolidSvg('M12 11.5a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8ZM4.8 20.1c.1-4 3-6.5 7.2-6.5s7.1 2.5 7.2 6.5v.4H4.8v-.4Z'));var copy=oklaElement('span','okla-header-copy');copy.appendChild(oklaElement('strong','','Můj účet'));copy.appendChild(oklaElement('small','','Přihlásit se'));account.appendChild(icon);account.appendChild(copy);account.appendChild(oklaElement('span','okla-header-chevron'));account.addEventListener('click',function(){var origin=document.querySelector('.top-navigation-bar .top-nav-button-login');if(origin)origin.click();else window.location.href='/login/';});nav.insertBefore(account,cart);}if(!nav.querySelector('.okla-header-orders')){var orders=oklaElement('a','okla-header-orders');orders.href='/klient/';orders.rel='nofollow';orders.title='Moje objednávky';orders.setAttribute('aria-label','Moje objednávky');var bag=oklaSolidSvg('M7.7 2.6h8.6v2.7h3.8v16H3.9v-16h3.8Zm1.8 2.7h5V4h-5Z','okla-bag-body');var check=document.createElementNS('http://www.w3.org/2000/svg','path');check.setAttribute('d','m8.4 13.1 2.6 2.7 4.8-5.1');check.setAttribute('class','okla-bag-check');bag.appendChild(check);bag.style.setProperty('fill','#062b5e','important');bag.style.setProperty('stroke','none','important');var bp=bag.querySelector('.okla-bag-body');if(bp){bp.style.setProperty('fill','#062b5e','important');bp.style.setProperty('stroke','none','important');}check.style.setProperty('fill','none','important');check.style.setProperty('stroke','#fff','important');check.style.setProperty('stroke-width','1.7','important');orders.appendChild(bag);nav.insertBefore(orders,cart);}if(!nav.querySelector('.okla-header-favorites')){var fav=oklaElement('button','okla-header-favorites');fav.type='button';fav.title='Oblíbené produkty';fav.setAttribute('aria-label','Oblíbené produkty');var fh=oklaSolidSvg('M12 21.1C8.7 18.8 3 14.4 3 9.2 3 4.1 9.5 2.5 12 6.2c2.5-3.7 9-2.1 9 3 0 5.2-5.7 9.6-9 11.9Z');fh.style.setProperty('fill','#062b5e','important');fh.style.setProperty('stroke','none','important');fh.querySelector('path').style.setProperty('fill','#062b5e','important');fh.querySelector('path').style.setProperty('stroke','none','important');fav.appendChild(fh);fav.addEventListener('click',function(){oklaOpenFavorites();});nav.insertBefore(fav,cart);}if(!nav.querySelector('.okla-header-locale')){var locale=oklaElement('span','okla-header-locale');locale.title='Čeština · CZK';locale.setAttribute('aria-label','Čeština, česká koruna');locale.appendChild(oklaCzechFlag());nav.insertBefore(locale,cart);}cart.classList.remove('btn','btn-icon');cart.setAttribute('title','Nákupní košík');if(!cart.querySelector('.okla-cart-symbol')){var ico=oklaElement('span','okla-cart-symbol');ico.setAttribute('aria-hidden','true');ico.appendChild(oklaSvg(['M3 3h3l2 11c.2 1.3 1.3 2.2 2.6 2.2h8.1c1.1 0 2.1-.7 2.4-1.8l1.1-6.3H7','M10 21a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z','M18 21a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z']));cart.insertBefore(ico,cart.firstChild);}if(!nav.querySelector('.okla-mobile-actions')){var mobile=document.querySelector('.top-navigation-bar .responsive-tools');if(mobile){mobile.classList.add('okla-mobile-actions');nav.insertBefore(mobile,cart);}}nav.classList.add('okla-header-ready');}
  // Insert a warranty information strip exactly between the two Shoptet homepage groups.
  // OKLA V36: bespoke multicolor vector pictograms and exact one-card-per-click infinite warranty carousel.
  function oklaWarrantyIcon(type){var ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 48 48');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');var sets={
  time:[['M24 6.5a17.5 17.5 0 1 0 0 35 17.5 17.5 0 0 0 0-35Z','#18559d',2.7],['M24 12v12l7.5 4.5','#f2a518',3.2],['M24 4v3M24 41v3M4 24h3M41 24h3','#7eafd9',2]],
  rules:[['M12 5.5h17l7 7v27H12a3 3 0 0 1-3-3v-28a3 3 0 0 1 3-3Z','#6356bc',2.6],['M29 6v8h8','#9b8bdb',2.3],['M16 21h15M16 27h11M16 33h7','#417dcc',2.6],['m30 32 2.6 2.5 4.3-5.2','#28a2ba',2.7]],
  claim:[['M24 4.5 39 10v13.5c0 10.2-6.6 16.6-15 20-8.4-3.4-15-9.8-15-20V10L24 4.5Z','#14976c',2.8],['m16 24 5.7 5.5L33 18','#e5a621',3.5],['M24 8.2 35 12v11.6','#8dd7ae',1.8]],
  support:[['M8 27v-4a16 16 0 0 1 32 0v4','#8657c7',2.7],['M9 25H6a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h6V25H9Z','#e48c30',2.6],['M39 25h3a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-6V25h3Z','#e48c30',2.6],['M36 40c-2.2 3-5.7 4-10.5 4','#8657c7',2.6],['M25 44h-4','#8657c7',3.4]],
  contacts:[['M7 10h34v25H20l-9 7v-7H7a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z','#0d82b7',2.6],['M12 21h24M12 27h17','#e28240',2.8],['M32 6h10','#79bfd8',2.2]]
  };(sets[type]||sets.time).forEach(function(item){var path=document.createElementNS(ns,'path');path.setAttribute('d',item[0]);path.setAttribute('fill','none');path.setAttribute('stroke',item[1]);path.setAttribute('stroke-width',String(item[2]));path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');svg.appendChild(path);});return svg;}
  var WARRANTY_BLOCK_HTML='<div class="okla-warranty-inner"><div class="okla-warranty-content"><h2 class="okla-warranty-title">2 roky záruka.</h2><p class="okla-warranty-subtitle">Nakupujte s jistotou.</p></div><a href="/obchodni-podminky/" class="okla-warranty-button">Více o záruce</a></div>';
  function insertWarrantyBlock(){if(location.pathname!=='/'&&location.pathname!=='')return;var root=document.querySelector('main#content');if(!root)return;var rows=root.querySelectorAll('.okla-slider-shell'),row=rows[1];if(!row)return;var block=root.querySelector('#okla-warranty');if(!block){block=document.createElement('section');block.id='okla-warranty';block.setAttribute('aria-label','Informace o záruce');block.innerHTML=WARRANTY_BLOCK_HTML;}if(row.nextElementSibling!==block)row.after(block);}
  // Small self-contained favorites list, stored in this browser (Shoptet itself has no wishlist on this shop).
  var oklaFavKey='okla-local-favorites-v1';
  function oklaReadFavorites(){try{var o=JSON.parse(localStorage.getItem(oklaFavKey)||'[]');return Array.isArray(o)?o.filter(function(v){return v&&typeof v.url==='string'&&typeof v.name==='string';}).slice(0,80):[];}catch(_){return [];}}
  function oklaSaveFavorites(list){try{localStorage.setItem(oklaFavKey,JSON.stringify(list.slice(0,80)));}catch(_){}}
  function oklaOpenFavorites(){var existing=document.getElementById('okla-favorites-popover');if(existing)existing.remove();var screen=oklaElement('div');screen.id='okla-favorites-popover';screen.setAttribute('role','dialog');screen.setAttribute('aria-modal','true');screen.setAttribute('aria-label','Oblíbené produkty');var frame=oklaElement('div','okla-fav-window'),head=oklaElement('div','okla-fav-head');head.appendChild(oklaElement('strong','','Oblíbené produkty'));var close=oklaElement('button','','×');close.type='button';close.setAttribute('aria-label','Zavřít');close.addEventListener('click',function(){screen.remove();});head.appendChild(close);frame.appendChild(head);var items=oklaReadFavorites();if(!items.length)frame.appendChild(oklaElement('p','okla-fav-empty','Zatím nemáte uložené produkty. Srdíčkem na produktu ho přidáte do oblíbených.'));items.forEach(function(item){var line=oklaElement('div','okla-fav-row'),a=oklaElement('a','',item.name);a.href=item.url;line.appendChild(a);var rm=oklaElement('button','','Odebrat');rm.type='button';rm.addEventListener('click',function(){oklaSaveFavorites(oklaReadFavorites().filter(function(i){return i.url!==item.url;}));screen.remove();oklaInsertFavoriteButtons();oklaOpenFavorites();});line.appendChild(rm);frame.appendChild(line);});screen.appendChild(frame);screen.addEventListener('click',function(e){if(e.target===screen)screen.remove();});var onkey=function(e){if(e.key==='Escape'){screen.remove();document.removeEventListener('keydown',onkey);}};document.addEventListener('keydown',onkey);document.body.appendChild(screen);close.focus();}
  // V46: no hearts on product cards or product listings. Saved favorites remain accessible from the header.
  function oklaInsertFavoriteButtons(){
    document.querySelectorAll('#content .product .okla-fav-toggle,#content .products .okla-fav-toggle').forEach(function(el){el.remove();});
    return; /* favourites are not offered on this shop: no favourite button is created on the product page */
    var info=document.querySelector('body.type-detail #content .p-detail-info,body.type-detail #content .p-detail .p-info-wrapper,body.type-detail #content .p-detail');
    if(!info || info.querySelector('.okla-detail-favorite'))return;
    var titleNode=document.querySelector('body.type-detail #content h1');
    var name=titleNode?(titleNode.textContent||'').trim():'';
    if(!name)return;
    var url=location.pathname;
    var btn=oklaElement('button','okla-detail-favorite');btn.type='button';
    var icon=oklaSolidSvg('M12 21s-9-5.9-9-12c0-5.2 6.6-7 9-3.2 2.4-3.8 9-2 9 3.2 0 6.1-9 12-9 12Z');
    var label=oklaElement('span');btn.appendChild(icon);btn.appendChild(label);
    function update(){var active=oklaReadFavorites().some(function(item){return item.url===url;});btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',active?'true':'false');btn.setAttribute('aria-label',active?'Odebrat z oblíbených':'Přidat do oblíbených');label.textContent=active?'V oblíbených':'Přidat do oblíbených';}
    btn.addEventListener('click',function(){var all=oklaReadFavorites(),idx=all.findIndex(function(item){return item.url===url;});if(idx>=0)all.splice(idx,1);else all.push({url:url,name:name});oklaSaveFavorites(all);update();});update();
    var detailActions=info.querySelector('.add-to-cart,.p-detail-info-wrapper,.p-tools');if(detailActions&&detailActions.parentNode)detailActions.after(btn);else info.appendChild(btn);
  }
  // V35: force escape from Shoptet main's 20px gutters to both edges of the white content column.
  // V50: bleed only across the actual right-side main content corridor, not over the sidebar.
  // V53: exact edge-to-edge width inside the right Shoptet content corridor.
  // Keep the sidebar untouched and compensate pre-existing negative CSS margins.
  function alignWarrantyStrip(){
    var strip=document.getElementById('okla-warranty-strip');
    var main=strip&&strip.closest('main#content');
    if(!strip||!main)return;
    strip.style.removeProperty('margin-left');
    strip.style.removeProperty('margin-right');
    strip.style.removeProperty('width');
    strip.style.removeProperty('max-width');
    var natural=strip.getBoundingClientRect(),rect=main.getBoundingClientRect();
    if(natural.width<=0||rect.width<=0)return;
    var sidebar=document.querySelector('#content-wrapper aside.sidebar.sidebar-left');
    var targetLeft=rect.left,targetRight=rect.right;
    if(sidebar&&window.innerWidth>=992){
      var side=sidebar.getBoundingClientRect();
      // Only use the sidebar edge when it really borders the current content column.
      if(side.width>0&&side.right<=rect.left+4&&rect.left-side.right<90)
        targetLeft=side.right;
    }
    // On smaller screens the main box itself is the content corridor.
    var baseMargin=parseFloat(window.getComputedStyle(strip).marginLeft)||0;
    var newMargin=baseMargin+(targetLeft-natural.left);
    var newWidth=targetRight-targetLeft;
    if(!Number.isFinite(newMargin)||!Number.isFinite(newWidth)||newWidth<=0)return;
    strip.style.setProperty('margin-left',(Math.round(newMargin*100)/100)+'px','important');
    strip.style.setProperty('margin-right','0px','important');
    strip.style.setProperty('width',(Math.round(newWidth*100)/100)+'px','important');
    strip.style.setProperty('max-width','none','important');
  }
  function syncOklaExactHeader(){var nav=document.querySelector('#header .header-top>.navigation-buttons');if(!nav)return;var row=nav.querySelector('.okla-exact-header');if(window.innerWidth>=992){if(!row){row=document.createElement('div');row.className='okla-exact-header';row.setAttribute('role','group');row.setAttribute('aria-label','Účet, objednávky, oblíbené, jazyk a košík');nav.appendChild(row);}['.okla-header-account','.okla-header-orders','.okla-header-favorites','.okla-header-locale','a.cart-count'].forEach(function(q){var el=nav.querySelector(q);if(el&&el.parentNode!==row)row.appendChild(el);});[['.okla-header-orders','orders'],['a.cart-count','cart']].forEach(function(entry){var dest=row.querySelector(entry[0]),cls='okla-exact-separator--'+entry[1];if(dest&&!row.querySelector('.'+cls)){var line=document.createElement('span');line.className='okla-exact-separator '+cls;line.setAttribute('aria-hidden','true');row.insertBefore(line,dest);}});}else if(row){row.querySelectorAll('.okla-exact-separator').forEach(function(line){line.remove();});Array.from(row.children).forEach(function(el){nav.insertBefore(el,row);});row.remove();}}
  // V50: optical uniformity of right-side actions; single clean separators and crisp strokes.
  function refineOklaHeader(){
    var row=document.querySelector('#header .header-top .navigation-buttons .okla-exact-header');
    if(!row)return;
    var selectors=['.okla-header-orders','.okla-header-favorites','.okla-header-locale','a.cart-count'];
    var order=row.querySelector(selectors[0]),fav=row.querySelector(selectors[1]),locale=row.querySelector(selectors[2]),cart=row.querySelector(selectors[3]);
    if(order&&order.dataset.oklaIconVersion!=='50'){
      var b=oklaSvg(['M6 8h12l1.3 12H4.7L6 8Z','M9 9V6a3 3 0 0 1 6 0v3','m8.8 14 2.3 2.3 4.2-4.2']);
      b.classList.add('okla-header-lineicon');order.replaceChildren(b);order.dataset.oklaIconVersion='50';
    }
    if(fav&&fav.dataset.oklaIconVersion!=='50'){
      var h=oklaSvg(['M20.6 8.7c0 4.1-8.6 10.4-8.6 10.4S3.4 12.8 3.4 8.7a4.6 4.6 0 0 1 8.6-2.1 4.6 4.6 0 0 1 8.6 2.1Z']);
      h.classList.add('okla-header-lineicon');fav.replaceChildren(h);fav.dataset.oklaIconVersion='50';
    }
    if(locale&&locale.dataset.oklaIconVersion!=='50'){
      var flag=oklaCzechFlag();flag.classList.add('okla-header-flagicon');locale.replaceChildren(flag);locale.dataset.oklaIconVersion='50';
    }
    if(cart&&cart.dataset.oklaIconVersion!=='50'){
      var wrap=cart.querySelector('.okla-cart-symbol');
      if(!wrap){wrap=oklaElement('span','okla-cart-symbol');wrap.setAttribute('aria-hidden','true');cart.insertBefore(wrap,cart.firstChild);}
      var c=oklaSvg(['M3 3.5h2.3l2.1 10.7a2 2 0 0 0 1.9 1.6h8.3a2 2 0 0 0 1.9-1.6L21 7H6.2','M9.5 20.5h.02','M17.9 20.5h.02']);
      c.classList.add('okla-header-lineicon');wrap.replaceChildren(c);cart.dataset.oklaIconVersion='50';
    }
    // Remove historical span separators, then rebuild exactly one borderless 1px rule at each intended location.
    row.querySelectorAll(':scope > .okla-exact-separator').forEach(function(el){el.remove();});
    function separatorBefore(el,cls){
      if(!el)return;
      var line=oklaElement('span','okla-exact-separator '+cls);
      line.setAttribute('aria-hidden','true');row.insertBefore(line,el);
    }
    separatorBefore(order,'okla-exact-separator--orders');
    separatorBefore(cart,'okla-exact-separator--cart');
  }
  function bootstrap(){updateOklaHeader();syncOklaExactHeader();refineOklaHeader();insertIcons();initHomepage();insertWarrantyBlock();alignWarrantyStrip();oklaInsertFavoriteButtons();alignCategoryIcons();alignSidebarChrome();syncHeroHeight();syncCarousel();}
  var bannerDesktop=null;
  function syncCarousel(){var el=document.querySelector('#content .banners-row #carousel');if(!el||!window.jQuery||!window.jQuery.fn||typeof window.jQuery.fn.carousel!=='function')return;var desktop=window.innerWidth>=768;if(bannerDesktop===desktop)return;bannerDesktop=desktop;var $c=window.jQuery(el);if(desktop){$c.carousel('pause');$c.carousel(0);$c.carousel('pause');}else{$c.carousel('cycle');}}
  // OKLA V25: top hero is exactly as tall as each lower banner, on every desktop width.
  var oklaHeroObserver=null,oklaHeroObserved=null;
  function syncHeroHeight(){var row=document.querySelector('#content .banners-row'),main=row&&row.querySelector('#carousel'),lower=row&&row.querySelector('.next-to-carousel-banners>.banner-wrapper');if(!main||!lower)return;if(window.innerWidth<768){main.style.removeProperty('height');main.style.removeProperty('aspect-ratio');return;}var target=lower.getBoundingClientRect().height;if(target>0){main.style.setProperty('height',Math.round(target*100)/100+'px','important');main.style.setProperty('aspect-ratio','auto','important');}if('ResizeObserver'in window&&(!oklaHeroObserver||oklaHeroObserved!==lower)){if(oklaHeroObserver)oklaHeroObserver.disconnect();oklaHeroObserver=new ResizeObserver(function(){syncHeroHeight();});oklaHeroObserver.observe(lower);oklaHeroObserved=lower;}}
  function onResize(){syncOklaExactHeader();sliderInstances.forEach(function(s){s.resize();});alignCategoryIcons();alignSidebarChrome();alignWarrantyStrip();syncHeroHeight();syncCarousel();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootstrap);else bootstrap();
  window.addEventListener('load',function(){updateOklaHeader();syncOklaExactHeader();refineOklaHeader();initHomepage();insertWarrantyBlock();alignWarrantyStrip();oklaInsertFavoriteButtons();alignCategoryIcons();alignSidebarChrome();sliderInstances.forEach(function(s){s.resize();});syncHeroHeight();syncCarousel();});window.addEventListener('resize',onResize,{passive:true});
  // The ordering pages add their cart link later; they call this to build the same header as the homepage.
  window.oklaHeaderRefresh=function(){updateOklaHeader();syncOklaExactHeader();refineOklaHeader();};
})();