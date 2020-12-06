XY._M={A:{},a:{},l:{},m:{},s:{},cs:{o:[.4,.6],f:['#0095B6','#00FF00'],s:['#FFFFFF','#228B22']}}
function PC_LO(n,S,M,T){function Z(O,d,p,o){O.d=d;o=O.getProjection();p=o.fromLatLngToDivPixel(O.p);d.style.left=p.x+'px';d.style.top=p.y+'px'}
    M=XY._M;S=M.cs;M.CS={U:{fillOpacity:S.o[1],zIndex:3,strokeColor:S.s[0],fillColor:S.f[0]},C:{fillOpacity:S.o[1],zIndex:4,strokeColor:S.s[1],fillColor:S.f[1]}};
    setTimeout(function(){try{XY._p=(function(K){function K(p,t,a,m){this.p=p;this.t=t;this.a=a;this.m=m;this.d=null}
                K.prototype=new google.maps.OverlayView();T=K.prototype;T.onAdd=function(d,o){d=DCE('DIV');o=this;gg4(d,o.a,1);d.innerHTML="<div>"+o.t+"</div>";Z(o,d);o=o.getPanes();o.floatPane.appendChild(d)}
                T.draw=function(){Z(this,this.d)};T.onRemove=function(){this.P5(d).removeChild(this.d);this.d=null}
                T.hide=function(){if(this.d)this.d.style.visibility="hidden"};T.show=function(){if(this.d)this.d.style.visibility="visible"}
                T.toggle=function(o){o=this;if(o.d){if(o.d.style.visibility=="hidden")o.show();else o.hide()}}
                T.toggleDOM=function(o){o=this;if(o.getMap()) o.setMap(null);else o.setMap(o.m)}
                return K})();google.maps.Polygon.prototype.getBounds=function(b,p,s,i,j){b=new google.maps.LatLngBounds();PC_Bn(b,s.getPaths());return b}
            M.e={DW:function(){if(!S9(M.s.S)){if(M.e.finished){M.e.finished();M.e.finished=null}return}
                n=M.s.S.shift();if((S9(M.s.f)||S9(M.s.b))&&M.s.B)PC_ST(n);else PC_c(n,M.s.C)}}}catch(e){PC_LO(1000)}},n)}
PC_LO(1000)
function PC_Bn(b,P,p,i,y){for(i=0;i<P.getLength();i++){p=P.getAt(i);for(y=0;y<p.getLength();y++)b.extend(p.getAt(y))}}function PC_BN(a,B,p,P,j,i,y){b=B||new google.maps.LatLngBounds();for(j in a)PC_Bn(b,a[j].getPaths());return b}
function PC_SL(s,p,n,P,i){var g={},V=S4(s,','),A=[]
    for(i in V){p=V[i].trim().toUpperCase();if(/^[A-Z]+\d+[A-Z]?$/.test(p)){P=p.replace(/\d+[A-Z]?$/,'');if(!g[P]) g[P]=[];P3(g[P],p)}else if(/^[A-Z]+$/.test(p)) P3(A,p)}for(n in g)P3(A,g[n]);return A}
function PC_R(D,i){D=S4(D,'*');var R=[],F=XY._M.s.f,j=0,w,s,d,x;
    for(i in D){var t=S4(D[i]),n=t[0],b=false;if(Array.isArray(F)&&S9(F)){for(n in F){s=F[n];x=/^[A-Z]+$/.test(n);d=/^[A-Z]+\d+[A-Z]?$/.test(n);if((Array.isArray(s)&&((x&&new RegExp('^('+n+')\\d+[A-Z]?$').test(s[0]))||(d&&S5(s,n)>-1)))||(typeof s==='string'&&((x&&n==s)||(d&&new RegExp('^('+s+')\\d+[A-Z]?$').test(n))))){b=!b;break}}if(!b) continue}
        if(S5(t[1],'^')<0)P3(R,[n,[O(t[1])],polylabel([X(t[1],1)],1.0)]);else{w=[];s=S4(t[1],'^');for(j in s) P3(w,O(s[j]));P3(R,[n,w,polylabel([X(s[0],1)],1.0)])}}
    return R
    function O(s){if(S5(s,'`')<0)return X(s);else{s=S4(s,'`');return [X(s[0]),X(s[1])]}}
    function X(x,y,k,a,b){x=x.replace(/,\s+/g,',');var p=S4(x,/\s+/g),Z=[];
        for(k in p){x=S4(p[k],',');if(!isNaN(x[0])&&!isNaN(x[1])){a=I7(x[1]);b=I7(x[0]);P3(Z,y?[a,b] :{lat:b,lng:a})}}
        return Z}}
function Pc(s,P,ck,I,n,m,x,i){m=XY._M;I=m.I;if(s) m.X=PC_R(s)
    if(m.X){if(!m.m[I]){x=["labels.text","labels.text.fill","labels.text.stroke","geometry","all","landscape"];
            m.m[I]=mM(I,{zoom:11,center:{lat:57.17267,lng:-2.01346},mapTypeId:'terrain',styles:[{featureType:x[4],elementType:x[3],stylers:[{visibility:"on"},{color:"#1a5c7f"}]},{featureType:x[4],elementType:x[1],stylers:[{gamma:.01},{lightness:20}]},{featureType:x[4],elementType:x[2],stylers:[{saturation:-31},{lightness:-33},{weight:2},{gamma:.8}]},{featureType:x[4],elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:x[0],stylers:[{hue:"#00cbff"},{visibility:"simplified"}]},{featureType:"administrative",elementType:x[1],stylers:[{color:"#acf4f4"},{visibility:"simplified"}]},{featureType:"administrative",elementType:x[2],stylers:[{color:"#a9dcd6"}]},{featureType:x[5],elementType:x[3],stylers:[{color:"#2f849a"}]},{featureType:x[5],elementType:"labels",stylers:[{visibility:"on"},{weight:"0.22"},{hue:"#00e6ff"}]},{featureType:x[5],elementType:x[0],stylers:[{weight:"1.830"}]},{featureType:x[5],elementType:x[2],stylers:[{weight:"0.5"}]},{featureType:"poi",elementType:x[3],stylers:[{saturation:20}]},{featureType:"poi.park",elementType:x[3],stylers:[{lightness:20},{saturation:-20}]},{featureType:"road",elementType:x[3],stylers:[{lightness:10},{saturation:-30}]},{featureType:"road",elementType:"geometry.stroke",stylers:[{saturation:25},{lightness:25}]},{featureType:"road.arterial",elementType:x[1],stylers:[{color:"#6fe7f4"}]},{featureType:"water",elementType:x[4],stylers:[{lightness:-20}]},{featureType:"water",elementType:x[0],stylers:[{color:"#1a85a1"}]}]});
            gg1(I,['pcm','lv'],[1,0]);ck=$('<label lh=0 onclick="_C(\'#'+I+'\',\'hl\')"><span></span>labels</label>').get(0);
            P3(m.m[I].controls[google.maps.ControlPosition.TOP_LEFT],ck)}
        var M=m.m[I],N=[];for(i in m.X){n=m.X[i];X(n[0],n[1],n[2]);P3(N,n[0])}
        M.addListener('click',function(){debugger;if(m.a[m.s.c]){if(!S9(m.s.f))PC_BL(M,m.s.c);M.fitBounds(E_q_B());gg0(I,'lv',0)}})
        M.addListener('zoom_changed',function(z){z=M.getZoom();gg4(this.getDiv(),'h',z<7?1 :0)})
        if(!S9(m.s.f))M.fitBounds(E_q_B())}
    function X(n,P,L,p,i,o){m.A[n]=[];for(i in P){p=P[i];o=new google.maps.Polygon({paths:p,strokeColor:'#FFFF00',strokeOpacity:0.8,strokeWeight:2,fillColor:'#FF0000',fillOpacity:0.0});
            o.setMap(M);o.labelOverlay=new XY._p(new google.maps.LatLng({lat:L[1],lng:L[0]}),n,"pb",M);o.labelOverlay.setMap(M)
            o.addListener('mouseout',function(e){PC_CS(m.A[n],{strokeColor:'#FFFF00',zIndex:0});o.labelOverlay.d.style.display=null})
            o.addListener('mouseover',function(e){o.labelOverlay.d.style.display='block';PC_CS(m.A[n],{strokeColor:'#FF0000',zIndex:1})})
            o.addListener('click',function(){debugger;if(!S9(m.s.f)) PC_ST(n)})
            P3(m.A[n],o)}m.a[n]={}}
    if(S9(m.s.f))Z(N);if(S9(m.s.b))Z(m.s.b.slice(0),1)
    function E_q_B(B,e){B=new google.maps.LatLngBounds();for(e in m.A){if(!S9(m.s.b)||S5(m.s.b,e)+1) PC_BN(m.A[e],B)}return B}
    function Z(n,e){m.s.S=m.s.b.slice(0);m.s.B=1;if(e) m.s.U=1
        m.e.finished=function(){M.fitBounds(E_q_B());m.s.B=0;if(e) m.s.U=0}
        PC_ST(m.s.S.shift())}}
function pc(d,o,p,k){var m=XY._M,c=m.s.l[S9(m.s.l)-1],D=m.cs,M=m.m[m.I];m.ad=PC_R(d);m.s.e[c]=[];m.l[c]={}
    for(k in m.ad){o=m.ad[k];Z(o[0],o[1],o[2])}
    function Z(n,P,L,l){var E=m.s.e[c]&&S5(m.s.e[c],n)>-1,i,j,x;m.a[c][n]=[]
        for(i in P){p=P[i];o=new google.maps.Polygon({paths:p,strokeColor:D.s[0],strokeOpacity:1,strokeWeight:1,fillColor:D.f[0],fillOpacity:D.o[0],zIndex:2});
            P3(m.a[c][n],o)
            if(typeof m.l[c][n]==='undefined')m.l[c][n]=new XY._p(new google.maps.LatLng({lat:L[1],lng:L[0]}),n,"pt",M);
            o.addListener('mouseout',function(e){l=m.l[c][n];if(l) $(l.d).removeClass('hover').attr('display',null);if(!E)PC_CS(m.a[c][n],{fillOpacity:D.o[0],zIndex:2})})
            o.addListener('mouseover',function(e){l=m.l[c][n];if(l) $(l.d).addClass('hover').attr('display','block')
                if(!E)PC_CS(m.a[c][n],{fillOpacity:D.o[1],zIndex:3})})
            o.addListener('click',function(){if(!m.s.r) PC_C(c,n)})
            if(m.s.e[c]&&E){x=m.a[c][n];for(j in x)x[j].setMap(M);PC_CS(x,m.CS.e)}}}
    if(m.s.D[c])setTimeout(function(){PC_DW.apply(null,m.s.D[c])},250)}
function PC_CS(a,s,i){if(a)for(i in a)a[i].setOptions(s)}
function PC_c(s,C,n,x,i,S,E){if(typeof s==='string')PC_ST(s,[],C)
    else{S={};E=0;for(n in XY._M.A){x=new RegExp('^'+n+'\\d');for(i in s){if(x.test(s[i])){if(!S[n]) S[n]=[];P3(S[n],s[i]);E++}}if(S9(s)==E)break}
        for(n in S) PC_ST(n,S[n],C)}}
function PC_DW(N,S,C,a,M,I,x,p,i,P,j,k){x=XY._M;I=x.I;M=x.m[I]
    for(n in x.a){if(n==N){Z(n);if(S){P=[];if(S9(S)){for(i in S)
                        if(x.a[N][S[i]]) X(S[i]);else{k=x.a[N];for(j in k)if(S5(j,S[i])+1&&!in0(S4(j,S[i])[1])) X(j)}
               }else for(p in x.a[N]) X(p,1)
                if(S9(P))W(P)}else W(x.A[N])}else S9(x.s.f)?0:PC_BL(x,n)}
    gg1(I,['l','lv'],[0,1]);x.e.DW()
    function W(a){if(!x.s.B) M.fitBounds(PC_BN(a))}
    function X(p,i,z){PC_C(N,p,C===false?C :true,i);z=x.a[N][p];PC_CS(z,{fillOpacity:x.cs.o[0],zIndex:2});for(i in z)P3(P,z[i])}
    function Z(n,o,m,i,z,y){x.s.c=n;PC_CS(x.A[n],{strokeColor:'#FFFF00',zIndex:0})
        z=x.a[n];for(m in z){y=z[m];for(i in y){o=y[i];o.setMap(M);o.setOptions({zIndex:2})}
            i=x.l[n][m];if(i){i.setMap(M);i.show()}}}}
function PC_ST(n,S,C,a,p,M){p=F+"UK/p/"+n+".js";M=XY._M;gg0(M.I,'l',1)
    if(S5(M.s.l,n)<0){P3(M.s.l,n);M.s.D[n]=[n,S,C,a];scLoad(p)}else PC_DW(n,S,C,a)}
function PC_C(c,n,C,x,M,L,i,E,z,y){M=XY._M
    if(M.l[c]){z=M.s.e[c];L=M.l[c][n];E=z&&S5(z,n)>-1;
        if((C===true&&E)||(C===false&&!E)) return;y=M.a[c][n];
        if(E){z.splice(S5(z,n),1);Z(0,'U')
            if(c != M.s.c&&!S9(M.s.f))for(i in y)y[i].setMap(null)}else{P3(z,n);Z(1,'C')}}
  function Z(h,a){PC_CS(y,M.CS[a]);if(L) $(L.d).attr({h:h});if(!x) maPAc()}}
function PC_BL(M,n,o,m,i,Z,Y){Z=M.a[n];if(!M.s.U)for(m in Z){for(i in Z[m]){o=Z[m][i];Y=M.s.e[n];if(Y&&S5(Y,m)<0) o.setMap(null);o.setOptions({zIndex:0})}M.l[n][m].hide()}}
function PC_sEL(d,i,s,v){d=XY._M.s.e;s=[];v=[];for(i in d){P3(s,i);P3(v,d[i])}return [s,S1(v)]}
function maPAs(y,z,I,w,W,M,Y){ftwls(I);M=XY._M;M.W=W;M.Y=I;gg0('pcmap','vs',1)
    if(!M.X){M.I='pcmp1';M.s={C:true,D:{},S:[],e:{},l:[],f:[],b:[]};Oi('pcmap','<a ic=1 onclick="gg0(\'pcmap\',\'vs\',0)"></a><div id='+M.I+'></div>')
        if(!M.E){EMp(['UK/pl'],0,1);M.E=1}
        EMp(['UK/mp'],0,1);setTimeout(function(){Pc();setTimeout(function(){Z()},500)},1000)}else Z()
    function Z(){if(y==3){if(XY.J.I>9&&!XY.J.pmx){XY.J.pmx=5;Y=S4(XY.J.X);z=Y[3]+','+Y[13]+','+z}
            M.s.S=PC_SL(z);PC_c(M.s.S.shift(),M.s.C)
       }if(y==1) M.s.b=S4(z,',');if(y==2) M.s.a=PC_SL(z)}}
function maPAc(i,w,O,M,a,j,s,P,p,E){w=PC_sEL();function T(){setTimeout(function(){maPAc()},1000)}
    if(w[1]){for(j in w[0]){P=w[0][j];O=G_0['p_'+P];if(!O){die_G(P,44,0,'',T);return}}
        M=XY._M;if(i){M.s.S=PC_SL(w[1]);PC_c(M.s.S.shift(),false)}
        else{G_2.p={};G_2.vp={};for(i in w[0]){P=w[0][i];O=G_0['p_'+P];a=S4(w[1],',');E=1;
                for(j in O){if(j.replace(/99/,'')==j&&S5(','+w[1]+',',','+j+',')==-1){E=0;break}}
                if(E)dCs('vp',P+'*'+M.W,M.Y,1)
                else{for(j in a){p=a[j];if(O[p]){s=O[p].c;dCs('p',s[0]+'`'+s[1]+'`'+s[2]+'`'+s[3]+'`'+s[4]+'`'+s[8],M.Y,1)}}}}}}}
