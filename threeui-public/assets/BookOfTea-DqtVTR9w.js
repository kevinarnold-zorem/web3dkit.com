import{r as e,j as h}from"./index-fOQwe-l-.js";const f=`<!doctype html>
<!--
  The Book of Japan — a hardbound reader in three.js  ·  dark edition
  ------------------------------------------------------------------
  · One WebGL scene: kraft boards, the page block, the fore-edge stack
    and the turning leaf.  Pages are typeset at
    runtime into canvas textures (Spectral, justified, hyphenated) from
    an original seven-chapter essay on the island, the gate, the room,
    the garden, the mended bowl, the single stroke and the falling
    blossom — written for this edition, first-party throughout.
  · Seven brush-drawn plates, each facing the chapter it opens, are
    generated as variable-width spline ribbons — no bitmaps anywhere.
    They are drawn in light ink so they read against the dark paper,
    with one seam of gold on the plate that wants it.
  · The page turn is an analytic curl: the leaf wraps onto a cylinder
    whose axis — the fold line — sweeps across the paper, so the flat
    part, the bright rolled edge and the read-through flap all fall out
    of one construction.
  · Every texture is drawn at device resolution; paper tooth and board
    fibre are laid down 1:1 with texels so nothing softens.
  · Responsive: a two-page spread on wide screens, one page at a time on
    narrow ones (the camera pans across the gutter).  Body type never
    renders below 11 px — the book repaginates instead.
  · Drag a leaf either way, flick it, tap either side, use ← →, the
    scrubber, or the wheel.
-->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>The Book of Japan — Reader</title>
<meta name="description" content="A hardbound dark-mode reader for The Book of Japan, an original essay in seven chapters, with a physically modelled page turn rendered in three.js.">
<meta name="theme-color" content="#0b0c0e">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;1,400&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root{
    --s: 0.5;      /* px per design unit — book geometry           */
    --u: 0.5;      /* px per design unit — chrome (floored so it   */
                   /* stays touchable on small screens)            */
    --camx: 0px;   /* horizontal camera pan, single-page layout    */
    --bw: 2244; --bh: 1611; --br: 15;

    --bg-top:#111318; --bg-mid:#0a0b0e; --bg-bot:#050607;
    --board:#2f261c;
    --pill:#22242a; --pill-text:#cdd0d6; --track:#41444c; --dot:#eceae4;
    --chev:#9ca0a8; --homebar:#484c54; --ring:#f0eee8; --label:#8c9098;
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%}
  body{
    background:
      radial-gradient(120% 72% at 50% -10%, var(--bg-top) 0%, rgba(17,19,24,0) 62%),
      linear-gradient(180deg,var(--bg-mid) 0%,var(--bg-mid) 42%,var(--bg-bot) 100%);
    font-family:"PT Sans",-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;
    overflow:hidden;
    -webkit-font-smoothing:antialiased;
    cursor:default;
    user-select:none;
    -webkit-user-select:none;
    color:var(--pill-text);
  }
  #stage{position:fixed;inset:0}
  #glow{
    position:absolute;left:50%;top:50%;
    width:calc(var(--s) * var(--bw) * 1px);
    height:calc(var(--s) * var(--bh) * 1px);
    transform:translate(-50%,-50%) translateX(calc(var(--camx) * -1));
    border-radius:calc(var(--s) * var(--br) * 1px);
    background:var(--board);
    box-shadow:
      0 calc(var(--s) * 5px)  calc(var(--s) * 16px) rgba(0,0,0,.55),
      0 calc(var(--s) * 20px) calc(var(--s) * 54px) rgba(0,0,0,.50),
      0 calc(var(--s) * 62px) calc(var(--s) * 190px) rgba(0,0,0,.55);
  }
  canvas#gl{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;cursor:grab}
  .grabbing canvas#gl{cursor:grabbing}
  .panning canvas#gl{cursor:ew-resize}
  #stage>*{transition:opacity .45s ease}
  #stage.leaving>*{opacity:0}

  /* ---------- chrome ---------- */
  .pill{
    position:absolute;
    background:var(--pill);
    border:0;
    border-radius:999px;
    color:var(--pill-text);
    box-shadow:0 calc(var(--u) * 2px) calc(var(--u) * 6px) rgba(0,0,0,.42),
               0 calc(var(--u) * 10px) calc(var(--u) * 26px) rgba(0,0,0,.34),
               inset 0 0 0 1px rgba(255,255,255,.045);
    display:flex;align-items:center;
    font-family:inherit;
  }
  #back{
    left:calc(var(--u) * 42px + max(0px, (100vw - var(--u) * 3456px)/2));
    top:max(calc(var(--u) * 41px), 12px);
    height:calc(var(--u) * 58px);
    padding:0 calc(var(--u) * 25px) 0 calc(var(--u) * 18px);
    gap:calc(var(--u) * 9px);
    font-size:calc(var(--u) * 19px);
    font-weight:400;
    letter-spacing:calc(var(--u) * 1.6px);
    cursor:pointer;
    transition:background .18s ease, transform .18s ease;
  }
  #back:hover{background:#2b2e35}
  #back:active{transform:scale(.97)}
  .chev{
    width:calc(var(--u) * 30px);height:calc(var(--u) * 30px);
    flex:0 0 auto;
    stroke:var(--chev);stroke-width:1.7;fill:none;
    stroke-linecap:round;stroke-linejoin:round;
  }
  #back .chev{stroke:var(--pill-text);stroke-width:2;width:calc(var(--u) * 22px);height:calc(var(--u) * 22px)}

  #scrub{
    left:50%;
    bottom:max(calc(var(--u) * 26px), 10px);
    transform:translateX(-50%);
    height:calc(var(--u) * 88px);
    width:min(calc(var(--u) * 724px), 92vw);
    padding:0 calc(var(--u) * 30px) 0 calc(var(--u) * 22px);
    gap:calc(var(--u) * 12px);
  }
  .navbtn{background:none;border:0;padding:0;display:flex;align-items:center;cursor:pointer;opacity:.9}
  .navbtn:hover{opacity:1}
  .navbtn:disabled{opacity:.28;cursor:default}
  #track{
    position:relative;flex:1 1 auto;height:calc(var(--u) * 40px);
    display:flex;align-items:center;cursor:pointer;
  }
  #track::before{
    content:"";position:absolute;left:0;right:0;height:calc(var(--u) * 4px);
    border-radius:999px;background:var(--track);
  }
  #dot{
    position:absolute;width:calc(var(--u) * 22px);height:calc(var(--u) * 22px);
    border-radius:999px;background:var(--dot);left:0;transform:translateX(-50%);
    transition:transform .12s ease;
    box-shadow:0 0 calc(var(--u) * 10px) rgba(236,234,228,.28);
  }
  #track:hover #dot{transform:translateX(-50%) scale(1.14)}
  #label{
    font-size:calc(var(--u) * 21px);color:var(--label);letter-spacing:calc(var(--u) * .6px);
    font-weight:400;min-width:calc(var(--u) * 76px);text-align:right;
    font-variant-numeric:tabular-nums;white-space:nowrap;
  }
  #homebar{
    position:absolute;left:50%;bottom:max(calc(var(--u) * 7px), 3px);
    width:calc(var(--u) * 105px);height:calc(var(--u) * 18px);
    border-radius:999px;background:var(--homebar);transform:translateX(-50%);
  }
  #ring{
    position:absolute;left:0;top:0;width:calc(var(--u) * 126px);height:calc(var(--u) * 126px);
    margin:calc(var(--u) * -63px) 0 0 calc(var(--u) * -63px);
    border-radius:999px;border:calc(var(--u) * 3px) solid var(--ring);
    pointer-events:none;opacity:0;transform:scale(.55);
    transition:opacity .13s ease, transform .13s cubic-bezier(.2,.9,.3,1.3);
  }
  #ring.on{opacity:.85;transform:scale(1)}
  #boot{
    position:fixed;inset:0;display:grid;place-items:center;
    background:linear-gradient(180deg,#0a0b0e,#050607);
    font-size:13px;letter-spacing:.16em;color:#5e626a;text-transform:uppercase;
    transition:opacity .5s ease;z-index:9;
  }
  #boot.gone{opacity:0;pointer-events:none}
</style>
</head>
<body>
<div id="stage">
  <div id="glow"></div>
  <canvas id="gl"></canvas>

  <button id="back" class="pill">
    <svg class="chev" viewBox="0 0 24 24"><path d="M15 5 8 12l7 7"/></svg>BACK
  </button>

  <div id="scrub" class="pill">
    <button class="navbtn" id="prev" aria-label="Previous page">
      <svg class="chev" viewBox="0 0 24 24"><path d="M15 5 8 12l7 7"/></svg>
    </button>
    <div id="track"><div id="dot"></div></div>
    <button class="navbtn" id="next" aria-label="Next page">
      <svg class="chev" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>
    </button>
    <div id="label">—</div>
  </div>

  <div id="homebar"></div>
  <div id="ring"></div>
</div>
<div id="boot">Setting the type…</div>

<script type="module">
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

/* ═══════════════════════════════════════════════════════════════
   1.  TEXT
   ═══════════════════════════════════════════════════════════════ */
const CHAPTERS = [{"n":"I","t":"The Island and the Season","p":["Begin with the ground, because the ground here has never agreed to hold still. Japan is not a country that happens to sit on an archipelago; it is an archipelago that has spent its whole history explaining itself to the people living on it. Some three thousand islands run for two thousand kilometres along the eastern rim of Asia, from the sub-arctic drift ice of Hokkaidō to the coral shelves of Okinawa, and along that whole length the land is folded, tipped and creased by the four tectonic plates grinding beneath it. Three quarters of it stands too steep to build on. Two thirds of it is forest. The remaining sliver, a ribbon of coastal plain narrower than most nations would consider a suburb, carries very nearly everyone.","That compression is the first fact of the culture, and almost everything else in this book is a consequence of it. When land is scarce, a room must do the work of several rooms. When the mountain comes down to the sea, a garden must contain a mountain rather than sit beneath one. When the same plain must hold a rice terrace, a shrine, a factory and a family, the boundaries between them are drawn by agreement and attention rather than by distance.","The second fact is that the ground moves. The islands sit on the most active seismic margin on earth, and they know it in the way a sailor knows weather — not as catastrophe but as condition. There are a hundred thousand tremors a year; a person notices perhaps a thousand of them. Every few decades one of them is not a tremor. The Great Kantō earthquake took Tokyo in 1923. Kobe went in 1995. In 2011 the sea floor off Tōhoku dropped and the water came inland for ten kilometres.","A culture can respond to that in two ways. It can build heavier, or it can build lighter. Japan chose lighter, and chose it early. The traditional house is a wooden frame that flexes: posts and beams jointed without glue, a heavy roof to hold the frame down, walls that are screens rather than structure. It is designed to sway, and if it fails, to fail into pieces a family can carry. Modern Tokyo simply moved the same idea into steel — base isolators, tuned mass dampers, skyscrapers engineered to lean rather than resist.","But the deeper response is not architectural. It is a settled refusal to treat permanence as the natural state of things. The inner shrines at Ise have been rebuilt from fresh hinoki cypress every twenty years for something like thirteen centuries. The buildings are never old. The site alternates between two adjacent plots, so that the empty one always waits beside the occupied one. What is being preserved is not the timber. It is the knowing — the joinery, the proportions, the sequence of the work, carried in the hands of carpenters who learn it once as apprentices and teach it once as masters. A building maintained for thirteen hundred years would be a relic. A building rebuilt sixty-two times is a practice.","I labour this because the Western reflex, encountering Japanese aesthetics, is to file them under restraint or minimalism, as though the culture had arrived at emptiness by taste. It arrived there by geology. Attachment to the fixed object is expensive on ground like this.","Now the seasons, which are the other half of the ground.","The archipelago spans twenty-five degrees of latitude and stands directly in the path of two great atmospheric machines: the Siberian high, which drives dry cold down from the continent in winter, and the Pacific monsoon, which drives wet heat up from the south in summer. The result is a climate of exceptional theatre. Winter on the Sea of Japan coast produces some of the heaviest snowfall recorded anywhere on earth — villages in Niigata dig down to their front doors. Summer in the same country is subtropical: thirty-five degrees, ninety per cent humidity, cicadas at a volume that has to be experienced to be credited.","Between the two sit the two short, exact seasons the country actually organises itself around. Spring arrives from the south in late March and travels north at roughly twenty-five kilometres a day. Autumn does the same journey in reverse, moving down from the Hokkaidō highlands in September. Both are broadcast on the evening news as fronts, with maps and dates, the way other countries broadcast storms.","And then, between them, the rainy season — tsuyu, the plum rain, six weeks of low grey warmth in June when the plums ripen and everything else grows mould. It is nobody's favourite season and it is honoured all the same, which tells you something.","The old calendar did not stop at four seasons, or even at the twenty-four solar terms borrowed from China. It divided the year into seventy-two kō, each lasting about five days, and gave each of them a name that is a small observation rather than a category. The east wind melts the ice. Bush warblers start singing in the mountains. Fish emerge from the ice. Rain moistens the earth. First rainbows. Silkworms start feasting on mulberry leaves. Rotten grass becomes fireflies. Earth is damp, air is humid. Cotton flowers bloom. Rice ripens. Swallows leave. Thunder ceases. Insects hole up underground. Maple leaves and ivy turn yellow. Bears start hibernating. Fish gather and stay under ice.","Read the list slowly. It is a calendar in which the unit of time is a thing you could go outside and check.","That habit of checking survives the calendar itself. It is why a letter, even a business letter, still opens with a line about the weather that is not small talk but form — a shared acknowledgement of where in the year the two correspondents are standing. It is why the seasonal word, the kigo, is not decoration in a seventeen-syllable poem but the load-bearing element: name the season and you have named the emotional register, and the remaining twelve syllables are free to do something else. It is why a confectioner in Kyoto will change the shape and colour of a sweet six times between March and May, and why the customers notice.","It is also, more quietly, why the food works. A cuisine built on a narrow, mountainous, sea-bounded country with a short growing season has no option but to be seasonal, and having no option it made a virtue and then a discipline of it — first bonito in spring, matsutake in autumn, the specific week when the bamboo shoot is worth digging. Shun, the word for the brief window in which an ingredient is at its peak, has no clean English equivalent, and its absence from English is itself a fact about the two cultures.","I have been describing conditions, not choices. That is deliberate. Almost everything that follows in this book — the moving wall, the raked gravel, the mended bowl, the single stroke, the loved and falling blossom — will look like an aesthetic preference, and each of them can be enjoyed as one. But they are downstream of a narrow, steep, shaking island where the year arrives in seventy-two instalments and nothing built of wood is expected to outlast its builder by very much.","The mountain on the plate opposite is the obvious emblem, and I have drawn it the way it is usually seen rather than the way it is usually pictured: not as a clean cone against a clean sky, but as a shape that the cloud has agreed, for the moment, to let you look at. Fuji is visible from Tokyo on perhaps eighty days a year, mostly in winter, mostly in the first hour after dawn. The rest of the time you know where it is and you cannot see it. That is not a failure of the view. That is the view."]},{"n":"II","t":"Torii, and What a Gate Means","p":["There is a gate standing in the water at Miyajima. At high tide it appears to float; at low tide you can walk out to it across the mud and put your hand on the camphor-wood pillar, which is the width of two men. It has no doors. It has no walls attached to it. It does not enclose anything and it cannot be locked. If you were determined to avoid it you could simply walk around it, and nothing would happen to you.","Every year several million people choose not to walk around it.","The torii is the most legible object in Japanese religious life and the least explicable in the vocabulary most visitors bring. It is not a door, because a door implies a wall. It is not a monument, because it commemorates nothing. It is a mark placed on the world to say: from here, attend differently. What lies beyond is not more sacred in the sense of being better guarded. It is sacred in the sense of being noticed.","To understand why that is enough, you have to give up on finding a doctrine. Shintō — the word is a late, retroactive coinage, made necessary only when Buddhism arrived and something had to be called the other thing — has no founder, no scripture that functions as scripture, no creed a believer could be asked to affirm, and no promise about what happens after death. What it has instead is kami: a word usually rendered as god or spirit, and better understood as something closer to presence, or charge, or that which stops you.","Kami are in waterfalls, in particular old trees, in unusually shaped rocks, in the sea, in rice, in the wind, in the ancestors of a village, in the founder of a craft, in a mountain, in a specific grove. Not in nature in general — that abstraction is foreign to the thing. In this waterfall. The tree at the top of that hill. The kami is local and particular, and the practice around it is correspondingly local and particular: you do not worship kami, you visit them, and there are eighty thousand shrines in Japan because there are that many places worth visiting.","The visit has a shape. You pass the torii, and you step slightly to the side rather than walking up the exact centre of the path, because the centre is the kami's. You stop at the temizuya, the water pavilion, and take the ladle in your right hand to rinse the left, then the left hand to rinse the right, then pour a little into your cupped palm to rinse your mouth, then stand the ladle upright so the last of the water runs down the handle you touched. You approach the hall. You throw a coin, ring the bell, bow twice, clap twice, hold your hands together and say what you came to say, and bow once more.","Notice what is absent from that sequence. There is no confession, because there is nothing structurally analogous to sin. There is no congregation, no service, no appointed hour and no officiant required. There is nothing you must believe in order to do it correctly. What there is, instead, is purification — the removal of kegare, which is best translated not as guilt but as accumulated grime, the ordinary fouling that comes from illness, death, blood, disorder and simply having been out in the world. Rinse it off. Then speak.","This is why the religion has been so hard to describe and so easy to practise. Surveys report that most Japanese people say they are not religious. The same population makes two hundred million shrine visits in the first three days of January. Both of those things are true at once, and they are only paradoxical if you insist that religion must consist of propositions a person either affirms or denies. Here it consists of what you do at a threshold.","The Buddhism that arrived from the continent in the sixth century did not displace any of this, which is the single most revealing fact about the Japanese religious temperament. It was absorbed. For most of the following thirteen hundred years the two systems were not merely tolerated side by side but structurally interleaved — temples inside shrine precincts, shrines guarding temple gates, kami understood as local manifestations of buddhas and buddhas understood as the true nature of kami. The state pulled them apart by decree in 1868, violently and for political reasons, and the separation never fully took in ordinary life. The common formulation still holds: married by Shintō, buried by Buddhism, and increasingly married by a rented chapel with a hired foreign officiant, which the culture accommodates with the same shrug. A family will keep a kamidana, a small shrine shelf, high on one wall and a butsudan, the Buddhist altar for the household dead, lower down on another, and see no contradiction because none is being asserted.","Underneath the tolerance is a genuinely different question. Christianity, Islam and Judaism ask what is true. This asks what is appropriate — to this place, at this season, for this occasion, in this house. Truth-questions produce heresy. Appropriateness-questions produce etiquette, and etiquette can absorb almost anything.","So: back to the gate, and to the objects around it.","The shimenawa is a thick rope of twisted rice straw, hung across a torii, tied around a tree, laid over a rock. It marks. The zigzag paper streamers hanging from it, the shide, mark more emphatically. Neither has any function beyond the marking, and neither is decorative in the sense of being optional. Together they do what a frame does to a painting: they do not change the object, they change how you are standing in front of it.","The komainu, the paired lion-dogs at the approach, sit with one mouth open and one closed — the first sound and the last, the a and the un, beginning and end. The shrine hall itself may contain a mirror. It is not an image of the kami. It is a mirror, and looking into it is the entire point.","And once a year, or twice, the arrangement inverts. During a matsuri the kami is transferred into a portable shrine, a mikoshi, and carried out of the precinct and through the streets by dozens of shouting people who deliberately jolt and rock it, because the kami is understood to enjoy the disturbance. The sacred does not stay behind the gate. It is brought out, sweated over, paraded past the convenience store and the parked cars, and returned. Nothing about the day is solemn. A great deal about it is serious.","I have called this chapter after the gate because the gate is the mechanism, and the mechanism recurs. You will meet it again in the low door of the tea room that forces a guest to stoop, in the stone step at the entrance of a house where the shoes come off, in the raked border of gravel that says the garden begins here, in the pause a Noh actor takes before he moves. In each case a threshold is built, nothing is prevented, and everything changes on crossing.","A wall keeps people out. A gate tells them where they are. This culture has always had more use for the second."]},{"n":"III","t":"The Shape of a Room","p":["A traditional Japanese house has almost no walls, and the ones it has are not where you would expect them.","The structure is a cage of wood: posts standing on stone footings, beams jointed into them, a heavy tiled roof pressing the whole assembly down. The posts carry the load. Nothing else does. Which means that every vertical surface between the posts is free to be something other than structure, and in this architecture it is: a paper screen that slides, a papered panel that lifts out of its track entirely, a shutter, a hanging reed blind, or nothing at all.","The consequence is a house with no fixed plan. Slide the fusuma back and two rooms are one room. Lift them out and store them for the summer, and the ground floor is a single shaded pavilion open to the garden on two sides. Close everything and a family of six has private sleeping quarters. The house does not have a living room and three bedrooms. It has a certain amount of floor, and a set of instructions for dividing it, and the division is made fresh according to the day, the season and the number of people.","Even the floor is modular. The tatami mat — a compressed rice-straw core, a woven rush facing, a cloth border — is roughly one metre by two, and it is not a floor covering so much as a unit of account. Rooms are still described by mat count: a four-and-a-half-mat room, a six-mat room, an eight-mat room. Property advertisements in a city of steel and concrete towers still quote it. The mat sets the module, the module sets the post spacing, the post spacing sets the width of the screens, and the width of the screens sets the proportion of everything you look at. A carpenter arriving at an unfamiliar site already knows most of the dimensions.","There is a further discipline in the mats, which is that they are laid in patterns, and one pattern — four mats meeting at a single point — is avoided in ordinary use because it is the arrangement used at funerals. The grid is not merely a grid. It is read.","Now the entrance, which is the part visitors misunderstand first and remember longest.","You do not walk into a Japanese house. You step down into a genkan, a floor of stone or tile set lower than the rest of the building, take off your shoes, turn them to face the door, and step up onto the raised wooden floor. The whole boundary between outside and inside is expressed vertically, in a step of perhaps twenty centimetres, rather than horizontally in a door. The door is just weather.","This is not a rule about cleanliness, though it is very effective at cleanliness. It is the same mechanism as the torii, moved indoors: a threshold that costs a small deliberate act to cross. You cannot enter absent-mindedly. The act is required of everyone, including the owner, including a head of state, and it is required every single time. Offices have them. Schools have them, with a locker of indoor shoes. Some restaurants, most clinics, every temple, and — the detail that finally convinces people — a great many construction sites, where workers change footwear to walk on a floor that is not yet a floor.","Inside, the light is managed rather than admitted. Shōji, the white paper screens on a fine wooden lattice, do not let you see out and do not let anyone see in; they turn the sun into a flat, even, dimensionless glow that fills a room without a direction. The deep eave above the veranda cuts the sky out of the picture entirely, so what reaches the paper is largely light reflected up off the garden. A traditional room is therefore lit from below and from the side by a green or grey or snow-white bounce, and the interior recedes into a graded dimness rather than ending at a bright wall.","Tanizaki wrote the definitive essay on this in 1933, and the argument in it that has lasted is not the nostalgia but the observation: that lacquer, gold leaf, unglazed pottery and old wood were all developed to be seen in that dimness, and that a bright even electric light does not reveal them but flattens them. The gold on a screen is not there to shine. It is there to hold the last of the light after everything else has given up.","Against that graded dark, the room is furnished by subtraction. There is no permanent furniture in the Western sense, because furniture would fix the plan the screens exist to keep loose. Bedding comes out of a cupboard at night and goes back in the morning. A low table is carried in for a meal. Cushions are stacked. What remains, in the principal room, is a single recess: the tokonoma, an alcove slightly raised, containing a hanging scroll and, usually, one arrangement of flowers or one object.","One. Not a collection. The alcove is the room's only site of display, and its rule is that it holds what is right for now — this month, this weather, this guest — and that the rest is put away. A household with fifty scrolls shows one. The scroll changes; the alcove does not. It is a gallery with a hanging policy of extreme severity, and it produces, in a room with nothing else in it, an object that cannot be ignored.","All of which brings us to the word that this chapter has been circling, which is ma.","Ma is written with a character showing the sun seen through a gate, and it means the interval — the gap, the pause, the distance between, the space that is not filled. It is used of rooms, of the spacing of stones, of the silence between two lines of dialogue in a Noh play, of the beat a comedian leaves before the punchline, of the emptiness in a painting, of the pause before a bow. A performer with bad timing is said to have bad ma. A room that is over-furnished has lost its ma.","The distinction that matters is between empty and interval. Western minimalism tends to treat emptiness as an absence achieved by removing things, and it is often, underneath, a display of the wealth required to not need things. Ma is not an absence. It is a positive element with a size and a shape, placed as deliberately as any object, and the two are read together — the stone and the gravel around it, the note and the rest after it, the alcove and the single scroll in it. Take the scroll away and you do not have more ma. You have an empty alcove, which is a different and worse thing.","Then there is the engawa, and I would put it near the top of any list of things this architecture got right. It is a wooden veranda running along the outside of the rooms and inside the line of the outer shutters — a floor that is neither in the house nor out of it. You sit on it with your feet on the garden stones and your back in the room. Half the domestic life of a Japanese summer happens there. It is the architectural expression of a preference this whole book keeps running into: not a boundary, but a graded transition; not in or out, but a place to be neither.","Almost none of this survives intact. The Japanese city is concrete, and the average apartment is small, sealed, insulated, air-conditioned and floored in vinyl. But go into one and the shoes still come off at a step by the door. The bedroom is very often still one tatami room. The living room still slides open into it with a paper-panelled door. The module persists after the reason for it has gone — which is what a deep habit looks like from the outside."]},{"n":"IV","t":"The Garden as an Argument","p":["The garden at Ryōan-ji is a rectangle of raked gravel about the size of a tennis court, walled on two sides, with fifteen stones set in it in five groups. There are no trees inside the wall. There is no water. There are no flowers, and there is nothing to walk on — you look at it from a wooden veranda, sitting down, from one side only.","It has been there for something like five hundred years. Nobody is certain who made it, nobody knows what it depicts, and the several confident interpretations — a tigress carrying cubs across a river, islands in a sea, the Chinese character for heart — are all much later than the garden. It is a rectangle with fifteen stones in it, and people sit in front of it in silence for a long time.","I want to take it seriously as an argument rather than as a mood, because the mood is easy to describe and impossible to defend, whereas the argument is quite precise.","The first move is subtraction of the expected material. A garden, in almost every tradition, is a place where growing things are arranged. This one removes the growing things and keeps the arrangement, which forces the arrangement to carry the entire load. What is left is composition: the interval between one group and the next, the height of a stone against the length of the wall behind it, the way three stones read as one mass from the left and as three from the right.","The second move is the substitution. Gravel raked in long parallel lines, breaking into concentric rings around each stone, is water — not a symbol of water in the way a flag is a symbol of a country, but water done by other means, with the movement and the reflection removed and the pattern kept. Karesansui means dry landscape, and the dryness is the point: it is a sea you can look at for a century without it changing, which is a thing no sea will do for you.","The third move is the withholding. From every position on the veranda, one of the fifteen stones is hidden behind another. There is no vantage from which you can see them all. This is not an accident of the layout; the layout is too careful for that. It is a statement made in the only medium a garden has, and the statement is that the whole is not available. You can move along the veranda and change which stone is missing. You cannot arrive at the view that has none missing, and after a while you stop trying, and that stopping is what the garden was built to produce.","Around the same century, and often within a hundred metres of gardens like it, an entirely different kind of garden was being built for entirely different people, and it is worth putting the two side by side.","The stroll garden — the kind at Katsura, or Kenroku-en, or Rikugi-en — is designed as a sequence. A path takes you around a pond, and everything about the path is manipulated. The route bends so that you cannot see where it goes. A hedge or a rise deliberately blocks a famous view until you have gone another thirty paces, at which point it is revealed whole, from the one position that composes it. Stepping stones are set at irregular intervals, sometimes deliberately awkward, because a person picking their way across uneven stones has to look down, and can then be made to look up at a chosen moment. Bridges are placed to slow you. A tea house is placed to stop you.","It is cinema, essentially, four centuries before cinema: a cut, a reveal, a held shot, a change of pace, all controlled by the placement of things in the ground. The Japanese term for the technique of blocking a view in order to release it later is miegakure, hide-and-reveal, and it is used with the frankness of a professional stage direction.","And then there is shakkei, borrowed scenery, which is the most audacious idea in the whole tradition. A garden composes what it contains. Shakkei composes what it does not contain. A distant mountain, a temple roof on the next hill, a stand of cedars beyond the property line: the garden is designed so that its own hedge line, its own trees, its own framing device crops that far thing and pulls it into the composition. The middle distance is deliberately suppressed — a clipped hedge, a wall at exactly the right height — so that the eye jumps from the near arrangement straight to the mountain, and reads them as one picture. The mountain does not belong to you. It has been borrowed, and the garden is the frame, and the frame is the only part anyone actually built.","The material discipline underneath all of this is pruning, and it is the part that visitors find hardest to accept.","A Japanese garden pine is not a pine that has been allowed to grow. It is a pine that has been argued with for eighty years. Each spring the new candles are snapped back by hand to control the length of the extension. Each autumn old needles are pulled — pulled, not cut, one by one — to open the interior so that light and air reach the inner branches and the eye can read the structure. Branches are wired, weighted, propped on crutches, tied down over a decade to establish a horizontal line the tree would never have chosen. The result is a tree that looks, to an untrained eye, natural; and that is the intention, and it is entirely artificial, and everybody involved knows this and nobody finds it a contradiction.","The idea being expressed is not that nature is beautiful. It is that nature contains a beautiful form which is usually obscured by nature's own abundance, and that the gardener's job is to remove enough of the tree to let the tree be visible. It is exactly the argument of the alcove that holds one scroll, and exactly the argument of the raked gravel, and it is close to the argument of the single calligraphic stroke in the next chapter but one.","Which leaves the moss, and I will end here because the moss makes the point about time better than I can.","Kyoto's climate — humid, shaded, wet in summer — grows moss the way other places grow lawn, and the temple gardens use it as ground: a deep, uneven, luminous green that takes decades to establish and about a fortnight of neglect to lose. It is weeded by hand, with tweezers, by people kneeling. At Saihō-ji they have catalogued over a hundred species in one garden, arriving on their own and permitted or removed one at a time.","You cannot install a moss garden. You can only start one, and then be the person who does the tweezing for thirty years, and then hand the tweezers to somebody else. The gardener who set the stones at Ryōan-ji never saw the moss on them. The gardener training a pine today is establishing a line that will read properly around 2090. This is a craft practised entirely on a timescale longer than a career, by people who accept that they are working on somebody else's garden, and the acceptance is not resignation. It is the ordinary condition of the work."]},{"n":"V","t":"Wood, Paper, and the Mended Bowl","p":["Break a bowl in most places in the world and you have a decision to make: throw it away, or glue it back together and hope the repair does not show.","There is a third option, and it was made into a craft here around the fifteenth century. Clean the fracture. Fill it with urushi lacquer, tinted and thickened, and let it cure for weeks in a damp cabinet, because lacquer hardens by absorbing moisture rather than by drying. Build the seam up in layers, polish it back, and dust the final coat with powdered gold. The result is a bowl with a river of gold running across it, following exactly the line along which it failed.","Kintsugi is often explained in a sentence about embracing imperfection, which is true and which flattens it. The precise claim is stronger and stranger: that the history of an object is part of the object, that the moment it broke is a real event in its life, and that a repair which conceals that event has told a lie about the thing in order to make it look newer than it is. Gold is used because gold is not an apology. You do not disguise the fault line; you draw attention to it in the most expensive material available, and the bowl is afterwards worth more, and is genuinely more interesting to hold.","Once you have seen the argument you start seeing it everywhere in the culture's relation to material, so let us go through the materials.","Wood first, because wood is the substrate of everything. Hinoki — Japanese cypress — is straight-grained, pale, faintly pink, aromatic, rot-resistant, and it planes to a surface that reflects light. It is the timber of shrines, of the best bathtubs, of sushi counters and of the finest joinery, and it is not finished. It is not stained, varnished, oiled or sealed. It is planed, with a hand plane whose blade is set to take a shaving thin enough to read a newspaper through, and the planed surface is the finish. A hinoki counter is wiped, never scrubbed, and over thirty years it goes from pale to honey to amber, and that darkening is understood to be the counter improving.","Which explains the tools. The Japanese saw cuts on the pull stroke, not the push, so the blade is in tension rather than compression and can therefore be thinner — a narrower kerf, less waste, more control, and no need for the heavy back a Western saw requires. The plane, the kanna, also works on the pull. Both require you to move the tool towards your own body, which is the opposite of leaning your weight into the work, and both reward a light steady stroke over force. The Japanese chisel has a hollow ground into its back so that only a narrow band of steel has to be lapped flat, and the blade is laminated: a thin layer of very hard, very brittle high-carbon steel forge-welded to a soft iron body that supports it. Hard enough to hold an edge no Western blade will hold, soft enough not to shatter. The same lamination is used in swords, in kitchen knives, and in the plane blade that made the counter.","And the joinery is cut without fasteners. A traditional temple frame contains no nails and no glue in its structure: the members are cut so that they interlock, and the interlock is tightened by wedges and by the weight of the roof. Some of the joints are absurd — pieces that appear impossible to assemble until you find the one sequence in which they slide together. The practical reason is that a nailed frame in an earthquake fails at the nails, while a jointed frame can move slightly and settle. The other reason is that the joint can be taken apart. A temple is periodically dismantled, its rotten members replaced, and reassembled, and buildings that have been through this several times still contain some of their original timber. Repair, again, rather than replacement — the same argument as the gold seam, made in cypress.","Paper next. Washi is made from the long inner bast fibres of kōzo, mitsumata or gampi rather than from wood pulp, and the fibres are long enough that a sheet has grain and considerable tensile strength — you can tear it cleanly one way and not the other. It goes into the shōji screens of the last chapter, into lanterns, into umbrellas that are then oiled to shed rain, into the hinges of a folding screen, into clothing in poor centuries, into the conservation of Western manuscripts in every major museum today, because nothing else does the job as well. A paper wall is a serious wall in a country of humid summers: it breathes, it diffuses light, and when it is punctured a child can patch it with a rice-paste square cut in the shape of a maple leaf, which is how those patches are traditionally cut, because if the repair is going to show it may as well be a maple leaf.","Then lacquer. Urushi is the sap of a tree, harvested by scoring the trunk in summer, and it is a genuine industrial marvel: applied in dozens of coats, each polished, it produces a surface that is waterproof, acid-resistant, warm to the touch, and capable of a black with no highlight in it at all. It is also, in its raw state, a violent skin irritant, and lacquer workers develop tolerance over years of controlled exposure. A finished lacquer bowl is light enough to hold in one hand, hot soup and all, without burning your fingers. That is not a decorative property. That is the reason for the bowl.","And clay, which is where the argument gets its name. Wabi-sabi is the aesthetic of the tea bowl that is slightly wrong: a raku bowl pulled from the kiln at red heat and quenched in air or straw so that the glaze crazes unpredictably, a lip that is not level, a foot that is trimmed roughly, a glaze that pooled and ran and stopped where it stopped. These are not accidents that were tolerated. They are the reason the bowl is valuable. A perfectly regular bowl is available from a factory in any quantity; a bowl with one honest asymmetry in it is a record of a particular firing on a particular day, and the hand that holds it can feel that.","There is a story, worth telling because it is the whole doctrine in one image, about a tea master who asked a student to clean a garden path. The student swept it until there was not a leaf on it. The master then shook a tree so that a few leaves fell, and only then was the path finished.","The person who makes these things has a title, shokunin, and it does not translate to craftsman without loss. A shokunin is somebody who does one thing — knives, or tatami, or the wooden moulds for confectionery, or soba — and does it for a working lifetime, usually having entered as an apprentice who was permitted for the first years to sweep, carry, sharpen and watch. The apprenticeship is famously not explained. You are not told the angle; you are given a stone and told to sharpen, and after two years your hands know the angle. It is inefficient as pedagogy and effective as transmission, and it is the same mechanism as the shrine rebuilt every twenty years: the knowledge lives in the doing and it is passed by doing it beside somebody.","In the 1920s Yanagi Sōetsu gave a name to the part of this that had no advocates: mingei, the crafts of ordinary use, made by unknown hands in quantity for people who were going to wear them out. His claim was that the anonymous potter throwing his four-hundredth rice bowl of the week makes a better object than the artist making a statement, because at four hundred the hand has stopped deliberating and the form has been decided by the material and the use. It is an argument against self-expression, made by a man who was passionately expressing himself, and there is something very Japanese about that.","So: the mended bowl on the plate opposite. It is a real object type, it is worth more broken and repaired than it was whole, and the seam is drawn in gold so that you cannot miss it. Every idea in this chapter is in that seam — that material has a history, that repair is honourable, that the flaw is where the object becomes particular, and that the correct response to damage is neither concealment nor disposal but a slow and expensive act of attention."]},{"n":"VI","t":"The Discipline of the Line","p":["The circle on the plate opposite is called an ensō, and it is drawn in a single unbroken movement, usually in one breath, and it is never corrected.","It cannot be corrected. That is the whole condition of the medium. Sumi ink on absorbent paper takes the stroke instantly and permanently: there is no going back over a thin passage to thicken it, no lifting an edge that wobbled, no second coat. Where the brush hesitated, the paper drank and the line bled. Where the brush moved fast the bristles separated and left dry white streaks through the black. Where it lifted, the stroke ends in whatever shape the hand was making at the moment it left. The paper is an unforgiving instrument for recording a movement, and that is precisely why it was kept.","So a piece of calligraphy is not a picture of a character. It is a record of a body over a period of about four seconds — the speed, the pressure, the pauses, the angle of the wrist, the state of the person. Two masters writing the same character produce two documents that are not comparable as drawings and are entirely comparable as performances. This is why the tradition can treat a sheet with one word on it as a major work, and why it is hung in the alcove of the tea room where nothing else is hanging.","The materials enforce the discipline rather than assisting it. The brush is soft — usually goat, weasel or horse hair — and comes to a single point, and it has no spine at all; the width of the line is controlled entirely by how hard you press, which means the width of the line is a direct readout of the pressure of your arm. The ink is a solid stick of pine or oil soot bound with animal glue, and it is ground by hand against a wet stone before every session. Grinding takes ten or fifteen minutes. You cannot skip it, and while you are doing it you are not writing, and the tradition has always been perfectly clear that the grinding is part of the practice and not a delay before the practice.",{"v":["The stone is ground, the water goes black,","the brush is loaded, the breath is taken —","and only then, the four seconds."]},"And underneath the calligraphy is the mechanism that runs through nearly every skill in this country, which is kata.","A kata is a fixed form: a prescribed sequence of movements, done the same way every time, learned by imitation and repeated for years. Martial arts have kata. So does the tea ceremony, in which the sequence of folding the cloth, warming the bowl, measuring the powder and turning the bowl before drinking is set down to the position of individual fingers. So does Noh. So does the way a shop assistant hands you a receipt with two hands and a slight bow, and the way a sushi chef moves, and the way a swordsmith's assistant swings the hammer.","The Western reflex is to see this as the enemy of expression — a form imposed on a person, producing conformity. The claim being made is close to the opposite, and it is worth stating carefully. The kata exists to be absorbed until it is no longer being performed. In the beginning you are doing the form and it is visible that you are doing the form. After some years the form is doing you: the deliberation drops out, the sequence runs beneath conscious attention, and what surfaces is whatever is actually in the person that day. Expression is not achieved by discarding the form. It is what is left over once the form has stopped taking up any of your attention.","There is a three-word summary of this, borrowed from the martial arts and now used everywhere: shu, ha, ri. Shu — protect the form; copy it exactly, understand nothing, ask nothing. Ha — break the form; you have earned the right to vary it because you now know what it was for. Ri — leave the form; it is no longer outside you to depart from.","The gap between shu and ri is measured in decades, and the tradition is candid that most practitioners spend their whole lives in shu, and that this is not a failure.","Noh theatre is the most extreme instrument for this that anybody has built. It is six hundred years old, performed on a bare cypress stage with a single painted pine at the back, by masked actors who move at a speed that has to be adjusted to before it registers as movement at all. A step is a slow slide with the heel never leaving the floor until the toes lift at the last instant. A gesture that in any other theatre would take a second here takes fifteen. The masks are carved so that a small tilt of the head changes the whole expression — down for grief, up for joy — and an actor's entire emotional range on stage may consist of a few degrees of neck angle and the timing of when he does it.","That timing is ma again: the interval, the held silence, the beat before the drum. In Noh the pause is not a rest between the material. It is the material. A drummer's call — a long, strained, almost painful vocal cry before the stroke — exists to open the silence that the stroke will close.","Sumo compresses the same idea into four minutes. The two wrestlers spend most of the bout not fighting: entering, stamping, throwing salt to purify the ring, squatting, staring, standing, going back to their corners, returning, squatting again. This can go on for several minutes and the crowd is entirely engaged, because what is being watched is two men trying to synchronise on a moment of mutual readiness. Neither is permitted to start; they must arrive at starting at the same instant, by feel. Then it is over in six seconds.","The through-line from the ensō to the sumo ring is this. In all of these practices the outcome is not separable from the making of it. A calligraphic character is inseparable from the four seconds of the stroke. A tea bowl is inseparable from the firing it came out of. A Noh gesture is inseparable from the length of time it took. The object or the moment is a fossil of a process, and the tradition trains people, over a very long time, to read the fossil.","Which is why the circle is drawn open. The ensō almost always has a gap where the brush lifted before the circle closed, and the gap is not a mistake and not merely a symbol of imperfection. It is the honest end of a real movement made by a real arm that ran out of ink and breath at that particular point. Close the circle neatly and you would have a ring. Leave it open and you have a record of somebody drawing."]},{"n":"VII","t":"The Beauty of Passing Things","p":["Every spring the Japan Meteorological Agency and the private forecasters that compete with it publish a map of the country crossed by a series of dated contour lines. The lines run roughly east–west and they migrate north through March, April and May at about twenty-five kilometres a day. This is the sakura zensen, the cherry-blossom front, and it is reported on the evening news beside the rainfall and the temperature, with the same seriousness, because a great many plans depend on it.","What the front predicts is a window of about a week. Somei-yoshino, the cloned variety planted almost everywhere since the nineteenth century, opens over two or three days, holds for four or five, and then goes — and when it goes it goes completely, in an afternoon of wind, in a fall thick enough to drift against kerbs and cover the surface of a river until the water is not visible. The petals do not brown on the branch. They leave while they are still white.","That is the entire reason for the fuss, and the culture has never pretended otherwise.","Hanami — flower-viewing — is not a delicate practice. It is a national outdoor party: blue plastic sheets claimed since dawn by the most junior person in the office, convenience-store food, a great deal of beer, karaoke from a portable speaker, businessmen asleep under the trees by nine in the evening. Foreign visitors expecting contemplative silence are frequently disappointed and should not be; the noise is not a corruption of the thing. Sitting under a tree that will be bare in a week, in a large loud group of people you will not always know, is a perfectly coherent response to transience, and arguably a better one than sitting quietly.","The word for what is being felt is mono no aware, and it was coined as a critical term in the eighteenth century by Motoori Norinaga to describe what he thought the Heian court literature was actually about. It is usually rendered as the pathos of things, or the sensitivity to things, and neither quite works. It is the specific ache produced by a thing that is beautiful and is going: not grief, because nothing has gone wrong, and not nostalgia, because it has not happened yet. It is the emotion of being present at something in its last week.","The Buddhist term underneath it is mujō, impermanence, which arrived from the continent and found the ground here already prepared. Chapter one made the geological case: a country that rebuilds after earthquakes, fires and typhoons on a generational cycle does not need to be argued into the doctrine that things pass. What Buddhism supplied was not the observation but the permission — the idea that the passing is not a defect in the world to be regretted but the character of the world, and that the correct response is attention rather than resistance.",{"v":["Seven days of it, and the eighth day","the river carries a white skin north —","which is the part worth staying for."]},"The literature is built on it. The most famous prose opening in the language is the one about the bell at Gion, whose sound carries the impermanence of all things; the most famous essay collection begins with a river that flows on while the water in it is never the same. Both are eight hundred years old and both are memorised by schoolchildren, which means that a fourteen-year-old in Osaka has the doctrine of impermanence available as a quotation before they have any use for it.","And the poetry compresses it further. A haiku is seventeen sounds arranged in three phrases, and it has two structural obligations: a kigo, the seasonal word, and a kireji, the cutting word, which breaks the poem in two and leaves a gap between the halves. The gap does the work. Two images are set beside each other, the connection is not stated, and the reader closes it. It is ma in language — the interval as the load-bearing element — and it is the reason the form survives translation so badly and travels so well anyway.","Autumn gets the same treatment as spring, and I have always thought it is the better festival. Momijigari, maple-hunting, sends the same crowds up the same mountains six months later, following a front moving in the opposite direction, to look at leaves that are also about to fall. And between them there is tsukimi, moon-viewing, in the ninth lunar month, for which the traditionally admired moon is not the full one but the one just before or just after — because a moon a night short of full still has somewhere to go, and one a night past has just left it.","That is a fine distinction and the culture makes it in earnest. So is the distinction between a cherry tree in full bloom and one at seven-tenths. So is the preference, in the tea room, for the bowl with the flaw. The consistent claim across all of them is that completion is a slightly less interesting state than approach or departure, and that beauty is more legible in something on its way somewhere.","Which brings this book, finally, to the modern city, because the obvious objection to everything I have written is that it describes a country that no longer exists.","Tokyo was destroyed twice in twenty-two years — by the Kantō earthquake and fire in 1923, and by the firebombing of 1945 — and rebuilt both times at speed and without much sentiment about what had been there. It is now the largest metropolitan area on earth: thirty-seven million people, a rail system that moves twenty million passengers a day and reports delays in units of twenty seconds, a skyline of concrete and glass, and a building stock with an average lifespan of about thirty years, because in Japan a house is generally treated as a depreciating asset rather than an appreciating one, and a thirty-year-old house is commonly demolished and replaced rather than sold.","You can read that as the tradition's defeat or as its logical conclusion, and I think the second is closer. This is a culture that has never located value in the persistence of the physical object. Ise is rebuilt every twenty years. The temple frame is dismantled and re-timbered. The screen walls come out for the summer. The bowl is broken and mended in gold. A city that replaces its houses every generation is not a betrayal of that; it is the same instinct with a bulldozer.","And the old things are not gone. They are interleaved, which is the more accurate and much stranger picture. There is a shrine with a torii and a five-hundred-year-old ginkgo between two office towers in Shinjuku, and the salarymen crossing the precinct at lunch put their hands together at the hall without breaking stride. There is a nine-hundred-year-old temple three minutes from a shop selling collectible figurines on six floors. The convenience store sells rice balls, fried chicken, concert tickets and moon-viewing dumplings in the correct week. The seventy-two micro-seasons, revived as an app, will tell a woman on the Yamanote line that the bush warblers have started singing in the mountains.","None of this is preserved for tourists. It is simply what a culture looks like when it has never made continuity depend on things staying still.","So: the branch on the plate opposite is drawn with the blossoms already leaving it, and there are more petals in the air than on the wood. That is the correct proportion. A tree in full flower is a photograph. A tree losing it is the subject.","And a book, being an object, ends. This one has argued that the shape of a room, the raked gravel, the mended bowl, the single stroke and the week of blossom are all the same argument made in different materials, and that the argument was handed to the people who make these things by a narrow, steep, forested, shaking island where the year arrives in seventy-two instalments. If any of it has landed, it will not be as information. It will be the next time you notice that something is nearly over, and find that you are paying attention to it rather than looking away."]}];

/* ═══════════════════════════════════════════════════════════════
   2.  PALETTE  (dark edition)
   ═══════════════════════════════════════════════════════════════ */
const T = {
  board1:'#3d3226', board2:'#2f261c', board3:'#1d1710',   // kraft board
  boardSheen:'rgba(255,236,208,.10)',
  paper:'#2a2925',
  ink:'#e4dfd2', inkSoft:'#97938a', folio:'#c2bdb1',
  plate:'#f2ede1', plateGold:'#e6c68b',   // the plates are drawn light on the dark paper
  rule:'rgba(205,205,215,.30)',
  shade:'6,5,3',                    // occlusion painted over the leaves
  lift:'244,238,224',               // light catching the outer edges
  edgeBase:'#2a2620', edgeLeaf:[122,116,102]
};

/* ═══════════════════════════════════════════════════════════════
   3.  DESIGN CONSTANTS   (units = px of a 3456×1924 reference frame)
   ═══════════════════════════════════════════════════════════════ */
const FR_H = 1924;
const PAGE_W = 1076, PAGE_H = 1537;
const BOARD  = 46;                              // board overhang at the fore-edge
const BOOK_W = PAGE_W*2 + BOARD*2;              // 2244
const BOOK_H = PAGE_H + 22 + 52;                // 1611
const COVER_R = 15;
const PAGE_TOP_Y  =  BOOK_H/2 - 22;
const PAGE_BOT_Y  = -BOOK_H/2 + 52;
const BOOK_OFF_Y  = 0;          // the book sits concentric in the frame
const MIN_PX      = 11;            // body type never renders smaller

// typography (page-local, y down, origin = page top-left)
const MARG_OUT = 109, MARG_IN = 80;
const COL_W    = PAGE_W - MARG_OUT - MARG_IN;      // 887
const BODY_BASE = 28, LINE_BASE = 40, BASE_OFF_B = 21;
const TOP_Y    = 157, TEXT_BOT = 1437;
const OPEN_TOP_B = 427;
const RUN_BASE  = 61;
const NUM_BASE  = 1467;
const LBL_BASE_B = 186;
const HEAD_CAP  = 59;
const HEAD_BASE_B = 288;
const RULE_Y_B  = 338, RULE_W = 405;
const INDENT_B  = 44;

/* live metrics — recomputed whenever the type size changes */
let TS = 1;
let bodySize = BODY_BASE, LINE_H = LINE_BASE, BASE_OFF = BASE_OFF_B;
let MAX_LINES = 32, OPEN_LINES = 25, OPEN_TOP = OPEN_TOP_B;
let LBL_BASE = LBL_BASE_B, HEAD_BASE = HEAD_BASE_B, RULE_Y = RULE_Y_B, INDENT = INDENT_B;
let dispSize = 84, dropSize = 84;

const F_BODY = 'Spectral,"Iowan Old Style",Charter,Georgia,serif';
const F_DISP = 'Spectral,Georgia,serif';
const F_SANS = '"PT Sans",-apple-system,"Helvetica Neue",Arial,sans-serif';

function applyMetrics(ts){
  TS = ts;
  bodySize  = BODY_BASE * ts;
  LINE_H    = LINE_BASE * ts;
  BASE_OFF  = BASE_OFF_B * ts;
  INDENT    = INDENT_B * ts;
  OPEN_TOP  = TOP_Y + (OPEN_TOP_B  - TOP_Y) * ts;
  LBL_BASE  = TOP_Y + (LBL_BASE_B  - TOP_Y) * ts;
  HEAD_BASE = TOP_Y + (HEAD_BASE_B - TOP_Y) * ts;
  RULE_Y    = TOP_Y + (RULE_Y_B    - TOP_Y) * ts;
  MAX_LINES  = Math.max(6, Math.floor((TEXT_BOT - TOP_Y)   / LINE_H));
  OPEN_LINES = Math.max(3, Math.floor((TEXT_BOT - OPEN_TOP)/ LINE_H));
  calibrateDisplay();
}

/* ═══════════════════════════════════════════════════════════════
   4.  TYPESETTING
   ═══════════════════════════════════════════════════════════════ */
const mc  = document.createElement('canvas').getContext('2d');
const mc2 = document.createElement('canvas').getContext('2d');

const wcache = new Map();
function bodyFont(c){ c.font = \`\${bodySize}px \${F_BODY}\`; c.letterSpacing = '0px'; }
function w(s){ let v = wcache.get(s); if(v===undefined){ v = mc.measureText(s).width; wcache.set(s,v);} return v; }

const VOW = 'aeiouyAEIOUY';
const DIGRAPH = new Set(['ch','sh','th','ph','wh','gh','ck','ng','qu','rh']);
const SUFFIX = ['tion','sion','ment','ness','able','ible','ance','ence','ical','ious','ous','ing','ity','ism','ist','ive','ful','less','ship','hood','ward','wise','ally','ily'];

/* conservative English hyphenation: consonant-cluster splits + common suffixes */
const hcache = new Map();
function hyphenPoints(word){
  let p = hcache.get(word); if(p) return p;
  p = [];
  const core = word.replace(/[^A-Za-z]/g,'');
  if(core.length >= 7 && core.length === word.length){
    const low = word.toLowerCase();
    const isV = c => VOW.indexOf(c) >= 0;
    let i = 0;
    while(i < low.length){
      if(!isV(low[i])){ i++; continue; }
      let j = i+1;
      while(j < low.length && !isV(low[j])) j++;
      const cl = j - (i+1);
      if(cl >= 2 && j < low.length){
        const pair = low.slice(i+1, i+3);
        let cut = (cl === 2 && DIGRAPH.has(pair)) ? -1 : i+2;
        if(cl >= 3 && DIGRAPH.has(pair)) cut = i+1;
        if(cut > 0) p.push(cut);
      }
      i = j;
    }
    for(const s of SUFFIX){
      if(low.endsWith(s)){
        const k = low.length - s.length;
        // never break a doubled consonant apart from itself (impos-sible)
        const dbl = k >= 2 && low[k-1] === low[k-2] && !isV(low[k-1]);
        if(k >= 3 && !dbl) p.push(k);
      }
    }
    p = [...new Set(p)].filter(k => k >= 3 && word.length - k >= 3).sort((a,b)=>a-b);
  }
  hcache.set(word, p);
  return p;
}

/* Break a paragraph into justified lines. */
function layout(text, colW, opts){
  opts = opts || {};
  const words = text.split(' ');
  const spW = w(' ');
  const lines = [];
  let i = 0;
  while(i < words.length){
    const ln = lines.length;
    let left = (ln === 0 ? (opts.indent||0) : 0);
    if(opts.narrow && ln < opts.narrow.n) left += opts.narrow.dx;
    const avail = colW - left;

    let ws = [], nat = 0, k = i;
    while(k < words.length){
      const add = (ws.length ? spW : 0) + w(words[k]);
      if(nat + add > avail && ws.length) break;
      ws.push(words[k]); nat += add; k++;
    }
    let tail = null;
    if(k < words.length && ws.length){
      const slack = avail - nat;
      const gaps  = Math.max(1, ws.length - 1);
      if(slack / gaps > spW * 0.55){
        const word = words[k];
        const pts = hyphenPoints(word.replace(/[^A-Za-z]+$/,''));
        for(let t = pts.length - 1; t >= 0; t--){
          const pre = word.slice(0, pts[t]) + '-';
          if(nat + spW + w(pre) <= avail){
            ws.push(pre); nat += spW + w(pre);
            tail = word.slice(pts[t]);
            break;
          }
        }
      }
    }
    const last = (k >= words.length) && !tail;
    lines.push({ words: ws, nat, left, avail, justify: !last });
    if(tail){ words[k] = tail; i = k; } else i = k;
  }
  return lines;
}

function dropWidth(){
  mc2.font = \`600 \${dropSize}px \${F_DISP}\`;
  return mc2.measureText('T').width;
}

/* size the display face so its cap-height keeps the designed proportion */
function calibrateDisplay(){
  let s = HEAD_CAP * TS;
  for(let i=0;i<12;i++){
    mc2.font = \`600 \${s}px \${F_DISP}\`;
    const c = mc2.measureText('H').actualBoundingBoxAscent;
    if(!c) break;
    s = s * (HEAD_CAP * TS) / c;
  }
  dispSize = Math.round(s*10)/10 || 84*TS;
  dropSize = dispSize;
}

function paginate(){
  bodyFont(mc);
  wcache.clear();
  const pages = [];
  const push = p => { pages.push(p); return p; };

  push({ kind:'blank' });
  push({ kind:'title' });

  const dropAdv = dropWidth() + 11*TS;

  CHAPTERS.forEach((ch, ci) => {
    // the plate wants to be a verso so the chapter opens facing it
    if(pages.length % 2) push({ kind:'blank', mark:ci*1000 });
    push({ kind:'plate', plate:ci, mark:ci*1000 });
    let page = push({ kind:'open', num:ch.n, title:ch.t, lines:[], cap:OPEN_LINES, top:OPEN_TOP, chap:ch, mark:ci*1000 });
    let first = true;
    ch.p.forEach((para, pi) => {
      const id = ci*1000 + pi;
      if(page.mark === undefined) page.mark = id;

      if(para.v){                       // a quoted poem: its own centred block
        const vl = [{blank:true}]
          .concat(para.v.map(t => ({verse:t})))
          .concat([{blank:true}]);
        if(vl.length > page.cap - page.lines.length){
          page = push({kind:'text', lines:[], cap:MAX_LINES, top:TOP_Y, chap:ch, mark:id});
          page.lines.push(...vl.slice(1));
        } else {
          page.lines.push(...vl);
        }
        first = false;
        return;
      }

      const opts = {};
      const body = first ? para.slice(1) : para;
      if(first) opts.narrow = { n:2, dx:dropAdv };
      else opts.indent = INDENT;
      let ls = layout(body, COL_W, opts);
      if(!first && page.lines.length === 0) ls = layout(body, COL_W, {});

      let room = page.cap - page.lines.length;
      if(ls.length <= room){
        if(first) ls[0].drop = para[0];
        page.lines.push(...ls);
      } else if(ls.length > MAX_LINES){
        if(first) ls[0].drop = para[0];
        let idx = 0;
        while(idx < ls.length){
          room = page.cap - page.lines.length;
          if(room <= 0){ page = push({kind:'text', lines:[], cap:MAX_LINES, top:TOP_Y, chap:ch, mark:id}); room = MAX_LINES; }
          const take = Math.min(room, ls.length - idx);
          page.lines.push(...ls.slice(idx, idx+take));
          idx += take;
        }
      } else {
        page = push({kind:'text', lines:[], cap:MAX_LINES, top:TOP_Y, chap:ch, mark:id});
        page.lines.push(...layout(body, COL_W, {}));
      }
      first = false;
    });
    if(page.lines && page.lines.length && page.lines.length + 3 <= page.cap) page.tail = true;
  });
  if(pages.length % 2) push({kind:'blank'});
  return pages;
}

/* ═══════════════════════════════════════════════════════════════
   5.  PAGE PAINTING
   ═══════════════════════════════════════════════════════════════ */
let grainPattern = null, mottlePattern = null, fibrePattern = null;
function noiseCanvas(n, amp, tri){
  const c = document.createElement('canvas');
  c.width = c.height = n;
  const g = c.getContext('2d');
  const d = g.createImageData(n,n);
  for(let i=0;i<n*n;i++){
    let v = 0, m = tri ? 3 : 1;
    for(let k=0;k<m;k++) v += Math.random();
    v = (v/m - .5) * amp;
    d.data[i*4] = d.data[i*4+1] = d.data[i*4+2] = 128 + v;
    d.data[i*4+3] = 255;
  }
  g.putImageData(d,0,0);
  return c;
}
/* short pale/dark fibres, tiled — drawn 1:1 with texels so they stay crisp */
function fibreCanvas(n, count){
  const c = document.createElement('canvas');
  c.width = c.height = n;
  const g = c.getContext('2d');
  g.fillStyle = 'rgb(128,128,128)'; g.fillRect(0,0,n,n);
  g.lineCap = 'round';
  for(let i=0;i<count;i++){
    const x = Math.random()*n, y = Math.random()*n;
    const a = Math.random()*Math.PI, len = 3 + Math.random()*11;
    const pale = Math.random() < 0.55;
    const v = pale ? 128 + 26 + Math.random()*40 : 128 - 22 - Math.random()*34;
    g.strokeStyle = \`rgba(\${v|0},\${v|0},\${v|0},\${0.30 + Math.random()*0.45})\`;
    g.lineWidth = Math.random() < 0.75 ? 1 : 1.8;
    g.beginPath();
    // wrap by drawing the same fibre at the four tile offsets it may straddle
    for(const [ox,oy] of [[0,0],[n,0],[0,n],[-n,0],[0,-n]]){
      g.moveTo(x+ox, y+oy);
      g.lineTo(x+ox + Math.cos(a)*len, y+oy + Math.sin(a)*len);
    }
    g.stroke();
  }
  return c;
}
function makeGrain(){
  grainPattern = mc.createPattern(noiseCanvas(256, 40, true), 'repeat');
  fibrePattern = mc.createPattern(fibreCanvas(300, 900), 'repeat');
  const src = noiseCanvas(26, 74, true);
  const big = document.createElement('canvas');
  big.width = big.height = 448;
  const bg = big.getContext('2d');
  bg.imageSmoothingEnabled = true;
  bg.drawImage(src, 0, 0, 448, 448);
  mottlePattern = mc.createPattern(big, 'repeat');
}

/* shrink a display line so it never overruns the measure */
function fitDisplay(ctx, text, size){
  ctx.font = \`600 \${size}px \${F_DISP}\`;
  const wd = ctx.measureText(text).width;
  const maxw = COL_W * 0.98;
  return wd > maxw ? size * maxw / wd : size;
}

/* ═══════════════════════════════════════════════════════════════
   PLATES — brush-drawn frontispieces, one facing each chapter
   ═══════════════════════════════════════════════════════════════ */

/* Catmull-Rom through the control points */
function spline(pts, n){
  const P = [pts[0], ...pts, pts[pts.length-1]];
  const out = [];
  for(let i=0;i<P.length-3;i++){
    const [p0,p1,p2,p3] = [P[i],P[i+1],P[i+2],P[i+3]];
    for(let j=0;j<n;j++){
      const t=j/n, t2=t*t, t3=t2*t;
      out.push([
        0.5*((2*p1[0]) + (-p0[0]+p2[0])*t + (2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2 + (-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
        0.5*((2*p1[1]) + (-p0[1]+p2[1])*t + (2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2 + (-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)
      ]);
    }
  }
  out.push(pts[pts.length-1]);
  return out;
}

/* a loaded brush: a filled ribbon whose width follows \`wf(t)\` */
function brush(g, pts, wf, seg){
  const S = spline(pts, seg || 16);
  const L = [], R = [];
  for(let i=0;i<S.length;i++){
    const a = S[Math.max(0,i-1)], b = S[Math.min(S.length-1,i+1)];
    let dx = b[0]-a[0], dy = b[1]-a[1];
    const d = Math.hypot(dx,dy) || 1; dx/=d; dy/=d;
    const w = Math.max(0.2, wf(i/(S.length-1))) / 2;
    L.push([S[i][0]-dy*w, S[i][1]+dx*w]);
    R.push([S[i][0]+dy*w, S[i][1]-dx*w]);
  }
  g.beginPath();
  g.moveTo(L[0][0], L[0][1]);
  for(let i=1;i<L.length;i++) g.lineTo(L[i][0], L[i][1]);
  for(let i=R.length-1;i>=0;i--) g.lineTo(R[i][0], R[i][1]);
  g.closePath();
  g.fill();
}
const taper = (w, a, b) => t => w * Math.pow(Math.sin(Math.PI*Math.min(1,Math.max(0,(t-0)/(1)))), 0.35) * (a + (b-a)*t);
const even  = w => () => w;
const swell = (w0, w1) => t => w0 + (w1-w0)*Math.sin(Math.PI*t);

/* each motif draws inside a 640 × 640 box centred on (0,0) */
const PLATES = [
  { name:'The Island and the Season', sub:'Fuji, on one of its eighty clear days',
    draw(g){
      // the two long slopes — concave, flaring out at the foot
      brush(g, [[-306,152],[-246,122],[-178,68],[-126,-12],[-76,-102]], t => 17-11*t);
      brush(g, [[306,152],[248,124],[180,70],[128,-10],[78,-102]], t => 17-11*t);
      // the summit: a broad, nearly level rim, notched
      brush(g, [[-76,-102],[-40,-124],[-4,-118],[34,-128],[78,-102]], t => 8+3*Math.sin(Math.PI*t));
      // the snow line, scalloped, running slope to slope
      brush(g, [[-118,-4],[-88,-32],[-56,-6],[-24,-36],[6,-10],[40,-38],[74,-12],[104,-32],[126,-8]],
            t => 5.2*Math.sin(Math.PI*t)+1.4, 14);
      // and the snow reaching down past it in fingers
      brush(g, [[-88,-30],[-98,2],[-110,20]], t => 4.6-3.2*t);
      brush(g, [[-24,-34],[-30,8],[-40,28]], t => 4.6-3.2*t);
      brush(g, [[40,-36],[48,6],[42,26]], t => 4.6-3.2*t);
      brush(g, [[104,-30],[114,-2],[110,14]], t => 4-2.8*t);
      // cloud, taking the base of the mountain away
      brush(g, [[-322,166],[-198,148],[-78,162],[38,144]], t => 14*Math.sin(Math.PI*t)+2.4);
      brush(g, [[-92,200],[62,182],[212,198],[328,178]], t => 15*Math.sin(Math.PI*t)+2.4);
      brush(g, [[-256,224],[-120,214],[28,228]], t => 9*Math.sin(Math.PI*t)+1.6);
      brush(g, [[118,252],[254,242]], t => 7*Math.sin(Math.PI*t)+1.4);
    }},

  { name:'Torii, and What a Gate Means', sub:'A gate with nothing to keep out',
    draw(g){
      // pillars, leaning very slightly in, heavier at the foot
      brush(g, [[-172,208],[-166,58],[-158,-116]], t => 31-15*t);
      brush(g, [[172,208],[166,58],[158,-116]], t => 31-15*t);
      // nuki — the tie beam driven through both pillars
      brush(g, [[-214,-44],[0,-51],[214,-44]], even(15));
      // shimaki — the flat bar carrying the lintel
      brush(g, [[-244,-122],[0,-131],[244,-122]], even(13));
      // kasagi — the lintel, whose ends sweep upward
      brush(g, [[-296,-188],[-238,-170],[-118,-156],[0,-152],[118,-156],[238,-170],[296,-188]],
             t => 18+7*Math.sin(Math.PI*t));
      // gakuzuka — the strut between beam and lintel
      brush(g, [[0,-124],[0,-52]], even(14));
      // the tide, arriving at the foot of it
      brush(g, [[-318,214],[-198,204],[-94,216],[14,206]], t => 7*Math.sin(Math.PI*t)+1.6);
      brush(g, [[-42,250],[92,240],[222,252],[320,242]], t => 8*Math.sin(Math.PI*t)+1.6);
      brush(g, [[-238,280],[-108,272],[32,284]], t => 6*Math.sin(Math.PI*t)+1.4);
      brush(g, [[132,304],[262,296]], t => 5*Math.sin(Math.PI*t)+1.2);
    }},

  { name:'The Shape of a Room', sub:'Shōji, and the light it has already softened',
    draw(g){
      const L0 = -272, L1 = -14, R0 = 14, R1 = 272, TOP = -240, BOT = 240;
      const rails = [-144, -48, 48, 144];
      // the outer frame of the run
      brush(g, [[L0,TOP],[R1,TOP]], even(11));
      brush(g, [[L0,BOT],[R1,BOT]], even(11));
      brush(g, [[L0,TOP],[L0,BOT]], even(11));
      brush(g, [[R1,TOP],[R1,BOT]], even(11));
      // the meeting stiles, where one leaf has been slid across the other
      brush(g, [[L1,TOP],[L1,BOT]], even(9));
      brush(g, [[R0,TOP],[R0,BOT]], even(9));
      // the kumiko of each leaf, broken at the stiles
      for(const x of [-186, -100]) brush(g, [[x,TOP+5],[x,BOT-5]], even(5));
      for(const x of [ 100, 186]) brush(g, [[x,TOP+5],[x,BOT-5]], even(5));
      for(const y of rails){
        brush(g, [[L0+5,y],[L1-5,y]], even(4));
        brush(g, [[R0+5,y],[R1-5,y]], even(4));
      }
      // the branch the garden puts against the paper
      brush(g, [[-306,226],[-198,180],[-84,146],[54,100],[178,36]], t => 13-8*t);
      brush(g, [[-124,164],[-94,110],[-106,60]], t => 6.5-4*t);
      brush(g, [[40,116],[76,70],[70,26]], t => 6.5-4*t);
      // and the few blossoms on it, arriving as marks only
      for(const [x,y,r] of [[-106,50,21],[70,18,18],[-16,124,15]]){
        for(let k=0;k<5;k++){
          const a = k/5*6.2832 + x*0.02;
          const nx = Math.cos(a), ny = Math.sin(a), px = -ny, py = nx;
          brush(g, [[x+nx*r*0.2, y+ny*r*0.2],
                    [x+nx*r*0.7+px*r*0.4, y+ny*r*0.7+py*r*0.4],
                    [x+nx*r, y+ny*r],
                    [x+nx*r*0.7-px*r*0.4, y+ny*r*0.7-py*r*0.4],
                    [x+nx*r*0.2, y+ny*r*0.2]], t => 3.8*Math.sin(Math.PI*t)+1.1, 10);
        }
      }
    }},

  { name:'The Garden as an Argument', sub:'Stones, and the gravel raked around them',
    draw(g){
      // each group carries its own ring system; the rake stops at the outermost ring
      const groups = [
        { c:[-124, 60, 94, 68], rings:[1.16, 1.42, 1.68],
          stones:[[-172, 28, 46, 31, 0.4], [-72, 100, 35, 23, 2.1]] },
        { c:[ 190,-78, 50, 38], rings:[1.32, 1.66, 2.00],
          stones:[[190,-78, 44, 32, 1.3]] },
        { c:[ 152, 152, 38, 26], rings:[1.36, 1.76],
          stones:[[152,152, 30, 20, 2.7]] },
      ];
      const worked = (x,y) => groups.some(({c, rings}) => {
        const f = rings[rings.length-1] * 1.07;
        return Math.hypot((x-c[0])/(c[2]*f), (y-c[1])/(c[3]*f)) < 1;
      });
      // the rake, in long straight passes across the open gravel
      for(let k=-5;k<=4;k++){
        const y = k*50 + 18;
        let run = [];
        for(let i=0;i<=44;i++){
          const x = -306 + i*14;
          const yy = y + 2.1*Math.sin(x*0.021 + k*1.7);
          if(worked(x,yy)){ if(run.length > 3) brush(g, run, even(3.4), 3); run = []; }
          else run.push([x,yy]);
        }
        if(run.length > 3) brush(g, run, even(3.4), 3);
      }
      // and worked into rings wherever a stone stands in it
      for(const {c, rings} of groups){
        for(const f of rings){
          const pts = [];
          for(let i=0;i<=30;i++){
            const a = i/30*6.2832;
            pts.push([c[0]+Math.cos(a)*c[2]*f, c[1]+Math.sin(a)*c[3]*f]);
          }
          brush(g, pts, even(3.2), 6);
        }
      }
      // the stones, set into it
      for(const {stones} of groups) for(const [cx,cy,rx,ry,seed] of stones){
        const pts = [];
        for(let i=0;i<=20;i++){
          const a = i/20*6.2832;
          const w = 1 + 0.15*Math.sin(a*3 + seed) + 0.08*Math.sin(a*5 - seed*1.7);
          pts.push([cx + Math.cos(a)*rx*w, cy + Math.sin(a)*ry*w]);
        }
        brush(g, pts, t => 11 + 4*Math.sin(t*7 + seed), 10);
      }
      // a fracture or two, so they read as stone rather than as shape
      brush(g, [[-186,32],[-152,48],[-120,30]], t => 5-2.8*t);
      brush(g, [[176,-98],[198,-72],[188,-44]], t => 4.6-2.4*t);
    }},

  { name:'Wood, Paper, and the Mended Bowl', sub:'The seam drawn exactly where it broke',
    draw(g){
      // rim — wider and shallower than a cup
      brush(g, [[-212,-84],[-106,-122],[0,-130],[106,-122],[212,-84]], swell(7,10));
      brush(g, [[212,-84],[106,-48],[0,-40],[-106,-48],[-212,-84]], swell(4,6));
      // body
      brush(g, [[-212,-84],[-196,14],[-126,100],[0,124]], swell(6,10));
      brush(g, [[212,-84],[196,14],[126,100],[0,124]], swell(6,10));
      // foot ring
      brush(g, [[-72,118],[-68,162],[-60,176]], even(7));
      brush(g, [[72,118],[68,162],[60,176]], even(7));
      brush(g, [[-60,176],[0,184],[60,176]], swell(5,8));
      // the mend, in gold, following the line along which it failed
      g.fillStyle = T.plateGold;
      brush(g, [[-62,-122],[-42,-54],[-70,8],[-36,62],[-56,118]], t => 10-5*t);
      brush(g, [[-42,-54],[26,-34],[80,-64],[134,-104]], t => 8-4.5*t);
      brush(g, [[-70,8],[-142,30],[-192,2]], t => 6.5-3.5*t);
      brush(g, [[-36,62],[36,90],[96,76]], t => 5.5-3*t);
      brush(g, [[26,-34],[46,10],[38,54]], t => 4.5-2.5*t);
      g.fillStyle = T.plate;
    }},

  { name:'The Discipline of the Line', sub:'One circle, one breath, left open',
    draw(g){
      const pts = [];
      const start = -0.42, end = start + Math.PI*2 - 0.62;
      for(let i=0;i<=26;i++){
        const a = start + (end-start)*i/26;
        const r = 214 + Math.sin(a*3.1+1.2)*7;
        pts.push([Math.cos(a)*r, Math.sin(a)*r]);
      }
      brush(g, pts, t => 6 + 34*Math.pow(Math.sin(Math.PI*Math.min(1,t*1.06)), 0.75) * (0.55 + 0.45*Math.sin(t*5.1)), 10);
    }},

  { name:'The Beauty of Passing Things', sub:'More of it in the air than on the branch',
    draw(g){
      // the branch
      brush(g, [[-252,190],[-136,118],[-18,34],[94,-64],[196,-174]], t => 17-13*t);
      brush(g, [[-58,76],[-30,18],[-52,-42]], t => 8-5*t);
      brush(g, [[68,-30],[110,-64],[110,-124]], t => 7-4*t);
      brush(g, [[-158,144],[-186,94],[-168,50]], t => 7-4*t);
      const blossom = (cx, cy, r, rot) => {
        for(let k=0;k<5;k++){
          const a = rot + k/5*6.2832;
          const nx = Math.cos(a), ny = Math.sin(a);
          const px = -ny, py = nx;
          brush(g, [[cx+nx*r*0.18, cy+ny*r*0.18],
                    [cx+nx*r*0.72+px*r*0.42, cy+ny*r*0.72+py*r*0.42],
                    [cx+nx*r, cy+ny*r],
                    [cx+nx*r*0.72-px*r*0.42, cy+ny*r*0.72-py*r*0.42],
                    [cx+nx*r*0.18, cy+ny*r*0.18]], t => 4.2*Math.sin(Math.PI*t)+1.2, 12);
        }
        for(let k=0;k<6;k++){
          const a = rot + 0.3 + k/6*6.2832;
          brush(g, [[cx,cy],[cx+Math.cos(a)*r*0.42, cy+Math.sin(a)*r*0.42]], t => 3-2*t);
        }
      };
      blossom(-50,-50, 42, 0.3);
      blossom(112,-134, 34, 1.1);
      blossom(-170,42, 29, 2.0);
      // and everything that has already left it
      const petal = (cx, cy, r, rot) => {
        const nx = Math.cos(rot), ny = Math.sin(rot), px = -ny, py = nx;
        brush(g, [[cx-nx*r, cy-ny*r],
                  [cx+px*r*0.52, cy+py*r*0.52],
                  [cx+nx*r, cy+ny*r],
                  [cx-px*r*0.52, cy-py*r*0.52],
                  [cx-nx*r, cy-ny*r]], t => 3.2*Math.sin(Math.PI*t)+1, 10);
      };
      const falling = [[-238,-108,16,0.8],[-152,-170,13,2.1],[-92,-10,14,1.4],
                       [34,98,15,0.4],[150,46,13,2.6],[238,-60,14,1.0],
                       [-268,66,12,1.9],[-26,182,14,0.2],[196,168,13,1.6],
                       [86,-192,12,2.3],[-120,222,11,0.9],[262,122,12,0.5],
                       [-206,-24,11,1.2],[10,-128,10,2.8],[132,238,11,2.2]];
      for(const [x,y,r,a] of falling) petal(x,y,r,a);
    }}
];

const ROMAN = ['I','II','III','IV','V','VI','VII'];

function paintPlate(ctx, page, TS){
  const P = PLATES[page.plate];
  ctx.save();
  ctx.translate(PAGE_W/2, 700);
  const s = (COL_W*0.99)/640;
  ctx.scale(s, s);
  ctx.fillStyle = T.plate;
  ctx.globalAlpha = 0.94;
  P.draw(ctx);
  ctx.restore();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = T.inkSoft;
  ctx.font = \`400 \${19*TS}px \${F_BODY}\`;
  ctx.letterSpacing = \`\${4.4*TS}px\`;
  ctx.fillText('PLATE ' + ROMAN[page.plate], PAGE_W/2, 1244);
  ctx.letterSpacing = '0px';
  ctx.fillStyle = T.ink;
  ctx.font = \`italic 400 \${24*TS}px \${F_BODY}\`;
  ctx.fillText(P.sub, PAGE_W/2, 1300);
  ctx.restore();
}

/* a small ornament closing a chapter */
function paintTail(ctx, y){
  ctx.save();
  ctx.translate(PAGE_W/2, y);
  ctx.fillStyle = T.inkSoft;
  ctx.globalAlpha = .75;
  brush(ctx, [[-52,0],[-18,-8],[0,0],[18,8],[52,0]], t => 3.4*Math.sin(Math.PI*t)+0.6, 12);
  brush(ctx, [[-4,-16],[0,-24],[4,-16],[0,-9],[-4,-16]], t => 3*Math.sin(Math.PI*t)+0.8, 12);
  ctx.restore();
}

function runningHead(page){
  if(!page.chap) return null;
  return page.chap.n + '.  ' + page.chap.t.toUpperCase();
}

function paintPage(ctx, page, index, TQ){
  ctx.save();
  ctx.scale(TQ, TQ);
  ctx.clearRect(0,0,PAGE_W,PAGE_H);

  ctx.fillStyle = T.paper;
  ctx.fillRect(0,0,PAGE_W,PAGE_H);

  // paper: soft mottle at page scale, then fibres and grain at texel scale
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = .46;
  ctx.fillStyle = mottlePattern;
  ctx.translate((index*137)%448, (index*263)%448);
  ctx.fillRect(-448,-448,PAGE_W+896,PAGE_H+896);
  ctx.restore();

  const DW = Math.round(PAGE_W*TQ), DH = Math.round(PAGE_H*TQ);
  ctx.save();
  ctx.setTransform(1,0,0,1,0,0);            // one pattern texel = one texture texel
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = .50;
  ctx.fillStyle = fibrePattern;
  ctx.translate((index*211)%300, (index*97)%300);
  ctx.fillRect(-300,-300,DW+600,DH+600);
  ctx.globalAlpha = .40;
  ctx.fillStyle = grainPattern;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.translate((index*37)%256, (index*91)%256);
  ctx.fillRect(-256,-256,DW+512,DH+512);
  ctx.restore();
  ctx.save(); ctx.scale(TQ,TQ);             // back to page units

  if(page.kind === 'blank'){ ctx.restore(); ctx.restore(); return; }

  if(page.kind === 'plate'){ paintPlate(ctx, page, TS); ctx.restore(); ctx.restore(); return; }

  const recto = index % 2 === 1;
  const x0 = recto ? MARG_IN : MARG_OUT;
  const nudge = recto ? -14 : 14;

  if(page.kind === 'title'){
    ctx.textAlign = 'center';
    ctx.fillStyle = T.inkSoft;
    ctx.font = \`400 \${20*TS}px \${F_BODY}\`;
    ctx.letterSpacing = \`\${4.2*TS}px\`;
    ctx.fillText('AN ESSAY IN SEVEN CHAPTERS', PAGE_W/2 + nudge, 560);
    ctx.letterSpacing = '0px';
    ctx.fillStyle = T.ink;
    ctx.font = \`600 \${fitDisplay(ctx, 'The Book', dispSize*1.28)}px \${F_DISP}\`;
    ctx.fillText('The Book', PAGE_W/2 + nudge, 700);
    ctx.fillText('of Japan', PAGE_W/2 + nudge, 700 + dispSize*1.42);
    ctx.strokeStyle = T.rule;
    ctx.lineWidth = 1.4*TS;
    ctx.beginPath();
    ctx.moveTo(PAGE_W/2-140 + nudge, 830 + dispSize*1.42);
    ctx.lineTo(PAGE_W/2+140 + nudge, 830 + dispSize*1.42);
    ctx.stroke();
    ctx.fillStyle = T.inkSoft;
    ctx.font = \`400 \${19*TS}px \${F_BODY}\`;
    ctx.letterSpacing = \`\${4.2*TS}px\`;
    ctx.fillText('MMXXVI', PAGE_W/2 + nudge, 900 + dispSize*1.42);
    ctx.letterSpacing = '0px';
    ctx.restore(); ctx.restore();
    return;
  }

  // running head
  if(page.kind === 'text'){
    ctx.fillStyle = T.inkSoft;
    ctx.font = \`400 \${18.2*TS}px \${F_BODY}\`;
    ctx.letterSpacing = \`\${2.6*TS}px\`;
    ctx.textAlign = recto ? 'right' : 'left';
    ctx.fillText(recto ? runningHead(page) : 'THE BOOK OF JAPAN',
                 recto ? PAGE_W - 52 + 2.6*TS : 55, RUN_BASE);
    ctx.letterSpacing = '0px';
  }

  // chapter opener block
  const top = page.top;
  if(page.kind === 'open'){
    ctx.textAlign = 'center';
    const cx = x0 + COL_W/2;
    ctx.fillStyle = T.inkSoft;
    ctx.font = \`400 \${21*TS}px \${F_BODY}\`;
    ctx.letterSpacing = \`\${3.4*TS}px\`;
    ctx.fillText('CHAPTER ' + page.num, cx + 1.5*TS, LBL_BASE);
    ctx.letterSpacing = '0px';
    ctx.fillStyle = T.ink;
    ctx.font = \`600 \${fitDisplay(ctx, page.title, dispSize)}px \${F_DISP}\`;
    ctx.fillText(page.title, cx, HEAD_BASE);
    ctx.strokeStyle = T.rule;
    ctx.lineWidth = 1.5*TS;
    ctx.beginPath();
    ctx.moveTo(cx - RULE_W*TS/2, RULE_Y); ctx.lineTo(cx + RULE_W*TS/2, RULE_Y);
    ctx.stroke();
  }

  // body
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = T.ink;
  bodyFont(mc);
  const spW0 = w(' ');
  bodyFont(ctx);

  page.lines.forEach((L,li) => {
    const y = top + li*LINE_H + BASE_OFF;
    if(L.blank) return;
    if(L.verse){
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = \`italic \${bodySize*0.96}px \${F_BODY}\`;
      ctx.fillStyle = T.ink;
      ctx.fillText(L.verse, x0 + COL_W/2, y);
      ctx.restore();
      return;
    }
    let x = x0 + L.left;
    const gaps = Math.max(1, L.words.length - 1);
    const extra = L.justify ? (L.avail - L.nat) / gaps : 0;
    for(let i=0;i<L.words.length;i++){
      ctx.fillText(L.words[i], x, y);
      x += w(L.words[i]) + spW0 + extra;
    }
    if(L.drop){
      ctx.save();
      ctx.letterSpacing = '0px';
      ctx.font = \`600 \${dropSize}px \${F_DISP}\`;
      ctx.fillStyle = T.ink;
      ctx.fillText(L.drop, x0, top + LINE_H + BASE_OFF);
      ctx.restore();
    }
  });

  if(page.tail) paintTail(ctx, page.top + (page.lines.length + 1.6)*LINE_H);

  // folio
  ctx.letterSpacing = '0px';
  ctx.fillStyle = T.folio;
  ctx.font = \`\${Math.round(bodySize*1.24)}px \${F_BODY}\`;
  ctx.textAlign = recto ? 'right' : 'left';
  ctx.fillText(String(index), recto ? PAGE_W - MARG_OUT : MARG_OUT, NUM_BASE);
  ctx.restore(); ctx.restore();
}

/* ═══════════════════════════════════════════════════════════════
   6.  SCENE
   ═══════════════════════════════════════════════════════════════ */
makeGrain();
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
const maxAniso = renderer.capabilities.getMaxAnisotropy();

const scene  = new THREE.Scene();
const FOV = 20;
const camera = new THREE.PerspectiveCamera(FOV, 1, 10, 40000);
camera.position.set(0,0,1000);

const book = new THREE.Group();
book.position.y = BOOK_OFF_Y;
scene.add(book);

const LIGHT = new THREE.Vector3(-0.30, 0.40, 0.865).normalize();

/* ---------- texture pool ---------- */
let TQ = 1;
const pool = [];
let useTick = 0;
const POOL_N = 6;

function initPool(){
  for(const p of pool) p.tex.dispose();
  pool.length = 0;
  for(let i=0;i<POOL_N;i++){
    const c = document.createElement('canvas');
    c.width  = Math.round(PAGE_W*TQ);
    c.height = Math.round(PAGE_H*TQ);
    const ctx = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = maxAniso;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    pool.push({canvas:c, ctx, tex, page:-1, used:0});
  }
}
function pageTex(i){
  i = Math.max(0, Math.min(PAGES.length-1, i));
  let slot = pool.find(p => p.page === i);
  if(!slot){
    slot = pool.reduce((a,b)=> a.used <= b.used ? a : b);
    slot.page = i;
    paintPage(slot.ctx, PAGES[i], i, TQ);
    slot.tex.needsUpdate = true;
  }
  slot.used = ++useTick;
  return slot.tex;
}

function rrect(g,x,y,wd,ht,r){
  g.beginPath();
  g.moveTo(x+r,y);
  g.arcTo(x+wd,y,x+wd,y+ht,r);
  g.arcTo(x+wd,y+ht,x,y+ht,r);
  g.arcTo(x,y+ht,x,y,r);
  g.arcTo(x,y,x+wd,y,r);
  g.closePath();
}

function coverTexture(){
  // bookbinding board: kraft pulp, flecked with fibre, worn brighter at the cut edge
  const S = 0.85, W = Math.round(BOOK_W/S), H = Math.round(BOOK_H/S);
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const u = W / BOOK_W;                       // texels per design unit

  g.save();
  rrect(g, 0,0,W,H, COVER_R*u);
  g.clip();

  // kraft is nearly flat in tone — only a whisper of falloff
  const grad = g.createLinearGradient(0,0,W*0.5,H);
  grad.addColorStop(0, T.board1);
  grad.addColorStop(.55, T.board2);
  grad.addColorStop(1, T.board3);
  g.fillStyle = grad; g.fillRect(0,0,W,H);

  // pulp: coarse mottle, then fibre, then tooth — all 1:1 with texels
  g.globalCompositeOperation = 'overlay';
  g.globalAlpha = .48; g.fillStyle = mottlePattern; g.fillRect(0,0,W,H);
  g.globalAlpha = .95; g.fillStyle = fibrePattern;  g.fillRect(0,0,W,H);
  g.globalAlpha = .55; g.fillStyle = grainPattern;  g.fillRect(0,0,W,H);
  g.globalCompositeOperation = 'source-over';
  g.globalAlpha = 1;

  let sd = 5;
  const rnd = () => (sd = (sd*1103515245 + 12345) & 0x7fffffff)/0x7fffffff;

  // chips of recycled stock pressed into the board
  for(let i=0;i<2600;i++){
    const x = rnd()*W, y = rnd()*H;
    const r = 0.6 + rnd()*2.6;
    const pale = rnd() < .45;
    g.fillStyle = pale ? \`rgba(226,202,166,\${0.05 + rnd()*0.16})\`
                       : \`rgba(16,10,4,\${0.06 + rnd()*0.20})\`;
    g.beginPath(); g.ellipse(x, y, r, r*(0.5+rnd()), rnd()*3.14, 0, 6.2832); g.fill();
  }
  // long pulp strands lying with the grain of the sheet
  g.lineCap = 'round';
  for(let i=0;i<520;i++){
    const x = rnd()*W, y = rnd()*H, len = (16 + rnd()*120)*u;
    const pale = rnd() < .5;
    g.strokeStyle = pale ? \`rgba(224,200,164,\${0.04 + rnd()*0.09})\`
                         : \`rgba(14,9,4,\${0.05 + rnd()*0.12})\`;
    g.lineWidth = (0.6 + rnd()*1.8)*u;
    g.beginPath();
    g.moveTo(x, y);
    g.bezierCurveTo(x+len*0.35, y+(rnd()-.5)*8*u, x+len*0.7, y+(rnd()-.5)*8*u, x+len, y+(rnd()-.5)*5*u);
    g.stroke();
  }

  // the cut edge catches a little light; the board falls away on the far sides
  const be = 10*u;
  const eg = g.createLinearGradient(0,0,0,be*2.6);
  eg.addColorStop(0,'rgba(206,182,150,.12)');
  eg.addColorStop(1,'rgba(206,182,150,0)');
  g.fillStyle = eg; g.fillRect(0,0,W,H);
  const eg2 = g.createLinearGradient(0,0,be*2.6,0);
  eg2.addColorStop(0,'rgba(206,182,150,.10)');
  eg2.addColorStop(1,'rgba(206,182,150,0)');
  g.fillStyle = eg2; g.fillRect(0,0,W,H);
  const dg1 = g.createLinearGradient(0,H-be*7,0,H);
  dg1.addColorStop(0,'rgba(0,0,0,0)'); dg1.addColorStop(1,'rgba(0,0,0,.36)');
  g.fillStyle = dg1; g.fillRect(0,0,W,H);
  const dg2 = g.createLinearGradient(W-be*7,0,W,0);
  dg2.addColorStop(0,'rgba(0,0,0,0)'); dg2.addColorStop(1,'rgba(0,0,0,.22)');
  g.fillStyle = dg2; g.fillRect(0,0,W,H);

  // a hairline where the board was trimmed
  g.strokeStyle = 'rgba(208,186,156,.11)';
  g.lineWidth = 1.6*u;
  rrect(g, 0.9*u,0.9*u,W-1.8*u,H-1.8*u, COVER_R*u);
  g.stroke();

  // the page block stands proud of the boards and casts into the well all round.
  // Clip to board-minus-block (even-odd) so only the spill lands on the card —
  // filling a rect would leave a hard corner where the fill stopped.
  const bx = BOARD*u, by = 22*u, bw = PAGE_W*2*u, bh = PAGE_H*u;
  g.save();
  g.beginPath();
  rrect(g, 0,0,W,H, COVER_R*u);
  g.rect(bx, by, bw, bh);
  g.clip('evenodd');
  g.shadowColor = 'rgba(0,0,0,.92)';
  g.shadowBlur = 26*u;
  g.shadowOffsetY = 7*u;
  g.fillStyle = '#000';
  g.fillRect(bx, by, bw, bh);
  g.shadowBlur = 9*u; g.shadowOffsetY = 2.5*u;      // a tighter contact pass
  g.shadowColor = 'rgba(0,0,0,.85)';
  g.fillRect(bx, by, bw, bh);
  g.restore();
  g.restore();

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  return t;
}

const coverMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(BOOK_W, BOOK_H),
  new THREE.MeshBasicMaterial({map: coverTexture(), transparent:true})
);
coverMesh.renderOrder = 0;
book.add(coverMesh);

const pageGeo = new THREE.PlaneGeometry(PAGE_W, PAGE_H, 1, 1);
function makePage(sideSign){
  const m = new THREE.Mesh(pageGeo, new THREE.MeshBasicMaterial({map:null}));
  m.position.set(sideSign * PAGE_W/2, (PAGE_TOP_Y + PAGE_BOT_Y)/2, 1.5);
  m.renderOrder = 1;
  book.add(m);
  return m;
}
const leftPage  = makePage(-1);
const rightPage = makePage(+1);

/* ---- shading overlay (gutter, vignette, edge lift) ---- */
const shadeCanvas = document.createElement('canvas');
shadeCanvas.width = BOOK_W/2; shadeCanvas.height = BOOK_H/2;
const shadeCtx = shadeCanvas.getContext('2d');
const shadeTex = new THREE.CanvasTexture(shadeCanvas);
shadeTex.colorSpace = THREE.SRGBColorSpace;
shadeTex.anisotropy = maxAniso;
const shadeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(BOOK_W, BOOK_H),
  new THREE.MeshBasicMaterial({map:shadeTex, transparent:true, depthWrite:false})
);
shadeMesh.position.z = 2.4;
shadeMesh.renderOrder = 2;
book.add(shadeMesh);

function stop(g, list){ for(const [p,a] of list) g.addColorStop(p, \`rgba(\${T.shade},\${a})\`); }
function lift(g, list){ for(const [p,a] of list) g.addColorStop(p, \`rgba(\${T.lift},\${a})\`); }

/* ---- the fold ----------------------------------------------------
   Near the spine each leaf bends down into the gutter.  Sample the
   shading of that curve rather than guessing at a gradient: the leaf
   tilts by theta, the light rakes in from the upper left, so the recto
   catches a rim of light just before it plunges and the verso simply
   falls away.  That asymmetry is what makes a gutter read.            */
const GUT = 134;                       // how far the curve reaches from the fold
function foldStops(sign){              // +1 recto (turns into the light), -1 verso
  const A = 0.385, D = 0.712, Lx = -0.30, Lz = 0.865;
  const dark = [], glint = [];
  const N = 24;
  for(let i=0;i<=N;i++){
    const t  = i/N;                                   // 0 at the fold, 1 where flat
    const th = (88*Math.PI/180) * Math.pow(1-t, 1.7);
    const nx = -sign*Math.sin(th), nz = Math.cos(th);
    const ao = 1 - 0.50*Math.pow(1-t, 3.2);           // the fold closes on itself
    const v  = (A + D*(nx*Lx + nz*Lz)) * ao;          // 1.0 == a flat leaf
    dark.push([t, Math.max(0, 1 - v)]);
    glint.push([t, Math.max(0, (v - 1) * 3.2)]);
  }
  return {dark, glint};
}

function drawShade(frac){
  const g = shadeCtx, S = 2;
  g.setTransform(1/S,0,0,1/S,0,0);
  g.clearRect(0,0,BOOK_W,BOOK_H);

  const px0 = BOOK_W/2 - PAGE_W, px1 = BOOK_W/2, px2 = BOOK_W/2 + PAGE_W;
  const py0 = 22, py1 = BOOK_H - 52, ph = py1 - py0;

  // verso — outer-edge fall-off only; the fold is drawn separately
  let lg = g.createLinearGradient(px0,0,px1,0);
  stop(lg, [[0,.13],[.018,.065],[.05,.012],[.55,0],[.8,.006],[1,.014]]);
  g.fillStyle = lg; g.fillRect(px0,py0,PAGE_W,ph);

  // recto — the light rakes from the left, so this leaf sits a shade deeper
  let rg = g.createLinearGradient(px1,0,px2,0);
  stop(rg, [[0,.022],[.12,.018],[.3,.016],[.55,.020],[.78,.036],[.9,.062],[.965,.095],[1,.15]]);
  g.fillStyle = rg; g.fillRect(px1,py0,PAGE_W,ph);

  // vertical falloff
  let vg = g.createLinearGradient(0,py0,0,py1);
  stop(vg, [[0,.004],[.35,.012],[.7,.029],[1,.056]]);
  g.fillStyle = vg; g.fillRect(px0,py0,PAGE_W*2,ph);

  // light falls from the upper left, so the fore corner of the recto sinks
  let dgd = g.createLinearGradient(px1, py0, px2, py1);
  stop(dgd, [[0,0],[.45,.005],[.75,.027],[1,.058]]);
  g.fillStyle = dgd; g.fillRect(px1,py0,PAGE_W,ph);

  // the fold itself
  const fv = foldStops(-1), fr = foldStops(+1);
  let gv = g.createLinearGradient(px1,0,px1-GUT,0);
  stop(gv, fv.dark);  g.fillStyle = gv; g.fillRect(px1-GUT,py0,GUT,ph);
  let gr = g.createLinearGradient(px1,0,px1+GUT,0);
  stop(gr, fr.dark);  g.fillStyle = gr; g.fillRect(px1,py0,GUT,ph);
  // the recto catches a rim of light where it turns over
  let sr = g.createLinearGradient(px1,0,px1+GUT,0);
  lift(sr, fr.glint); g.fillStyle = sr; g.fillRect(px1,py0,GUT,ph);
  // the crease, and the leaves converging into it
  let cr = g.createLinearGradient(px1-7,0,px1+7,0);
  stop(cr, [[0,0],[.4,.55],[.5,.72],[.6,.55],[1,0]]);
  g.fillStyle = cr; g.fillRect(px1-7,py0,14,ph);
  for(let i=1;i<=5;i++){
    const d = 9 + i*i*4.2, a = 0.20/(i*0.9);
    g.fillStyle = \`rgba(\${T.shade},\${a})\`;
    g.fillRect(px1-d-1.4, py0, 1.4, ph);
    g.fillRect(px1+d, py0, 1.4, ph);
  }
  // and the top leaf's own edge along the fore-edge of each side
  g.fillStyle = \`rgba(\${T.shade},.30)\`;
  g.fillRect(px0, py0, 2.2, ph);
  g.fillRect(px2-2.2, py0, 2.2, ph);

  // a thin lift along the head and the outer edges, so the leaves read
  let hl = g.createLinearGradient(0,py0,0,py0+160);
  lift(hl, [[0,.045],[1,0]]);
  g.fillStyle = hl; g.fillRect(px0,py0,PAGE_W*2,160);
  let el = g.createLinearGradient(px0,0,px0+80,0);
  lift(el, [[0,.045],[1,0]]);
  g.fillStyle = el; g.fillRect(px0,py0,80,ph);
  let er = g.createLinearGradient(px2,0,px2-80,0);
  lift(er, [[0,.03],[1,0]]);
  g.fillStyle = er; g.fillRect(px2-80,py0,80,ph);

  // tail edge of the block
  let tg = g.createLinearGradient(0,py1-30,0,py1);
  tg.addColorStop(0,'rgba(0,0,0,0)'); tg.addColorStop(1,'rgba(0,0,0,.34)');
  g.fillStyle = tg; g.fillRect(px0,py1-30,PAGE_W*2,30);

  shadeTex.needsUpdate = true;
  layoutEdges(frac);
}

/* ---- fore-edges: the visible stack of leaves inside the cover margin ---- */
const MARG = (BOOK_W - PAGE_W*2)/2;          // 29
const EDGE_PX = 2.4;
function edgeTexture(dir){
  const c = document.createElement('canvas');
  c.width = Math.round(MARG*EDGE_PX); c.height = 64;
  const g = c.getContext('2d');
  const W = c.width, H = c.height;
  g.fillStyle = T.edgeBase; g.fillRect(0,0,W,H);
  const step = 2.1*EDGE_PX;
  let seed = 21;
  const rnd = () => (seed = (seed*1103515245 + 12345) & 0x7fffffff)/0x7fffffff;
  const L = T.edgeLeaf;
  for(let x=0; x<W+step; x+=step){
    const j = (rnd()-0.5)*step*0.30;
    const lx = dir>0 ? W - x - j : x + j;
    const v = 0.68 + rnd()*0.46;
    g.fillStyle = \`rgb(\${Math.round(L[0]*v)},\${Math.round(L[1]*v)},\${Math.round(L[2]*v)})\`;
    g.fillRect(lx - step*0.5, 0, step*0.50, H);
  }
  const dg = g.createLinearGradient(dir>0?0:W, 0, dir>0?W:0, 0);
  dg.addColorStop(0,'rgba(0,0,0,.32)');
  dg.addColorStop(.35,'rgba(0,0,0,.06)');
  dg.addColorStop(1,'rgba(0,0,0,.22)');
  g.fillStyle = dg; g.fillRect(0,0,W,H);
  const vg = g.createLinearGradient(0,0,0,H);
  vg.addColorStop(0,'rgba(255,255,255,.11)');
  vg.addColorStop(.5,'rgba(0,0,0,0)');
  vg.addColorStop(1,'rgba(0,0,0,.36)');
  g.fillStyle = vg; g.fillRect(0,0,W,H);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  return t;
}
const edgeGeo = new THREE.PlaneGeometry(1, PAGE_H);
function makeEdge(dir){
  const m = new THREE.Mesh(edgeGeo, new THREE.MeshBasicMaterial({map: edgeTexture(dir), transparent:true, depthWrite:false}));
  m.renderOrder = 2;
  m.position.y = (PAGE_TOP_Y + PAGE_BOT_Y)/2;
  m.position.z = 1.6;
  book.add(m);
  return m;
}
const edgeR = makeEdge(+1), edgeL = makeEdge(-1);
const EDGE_MAX = MARG - 8;
function layoutEdges(frac){
  const wR = EDGE_MAX * Math.min(1, Math.max(0, (1-frac))*1.2);
  const wL = EDGE_MAX * Math.min(1, Math.max(0, frac)*1.2);
  edgeR.scale.x = Math.max(0.001, wR);
  edgeR.position.x = PAGE_W + wR/2;
  edgeR.visible = wR > 0.6;
  edgeL.scale.x = Math.max(0.001, wL);
  edgeL.position.x = -PAGE_W - wL/2;
  edgeL.visible = wL > 0.6;
}

/* ---- focus veil: in the narrow layout the facing page falls away ---- */
function veilTexture(){
  const c = document.createElement('canvas');
  c.width = 128; c.height = 4;
  const g = c.getContext('2d');
  const gr = g.createLinearGradient(0,0,128,0);
  gr.addColorStop(0,   'rgba(8,9,12,0)');
  gr.addColorStop(0.03,'rgba(8,9,12,0.36)');
  gr.addColorStop(0.10,'rgba(8,9,12,0.72)');
  gr.addColorStop(0.30,'rgba(8,9,12,0.89)');
  gr.addColorStop(1,   'rgba(8,9,12,0.95)');
  g.fillStyle = gr; g.fillRect(0,0,128,4);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const veil = new THREE.Mesh(
  new THREE.PlaneGeometry(PAGE_W + MARG*2, PAGE_H + 90),
  new THREE.MeshBasicMaterial({map: veilTexture(), transparent:true, depthWrite:false,
                               depthTest:false, side:THREE.DoubleSide, opacity:0})
);
veil.position.y = (PAGE_TOP_Y + PAGE_BOT_Y)/2;
veil.position.z = 3.0;
veil.renderOrder = 4;
veil.visible = false;
book.add(veil);

function updateVeil(){
  if(!single){ veil.visible = false; return; }
  const sgn = camX >= 0 ? -1 : 1;                       // dim the far leaf
  veil.position.x = sgn * (PAGE_W/2 + MARG);
  veil.scale.x = sgn;
  const a = Math.min(1, Math.abs(camX)/(PAGE_W*0.42));
  veil.material.opacity = a;
  veil.visible = a > 0.02;
}

/* ═══════════════════════════════════════════════════════════════
   7.  TURNING LEAF
   ═══════════════════════════════════════════════════════════════ */
const NX = 66, NY = 26;
const N = NX*NY;
const pos  = new Float32Array(N*3);
const rest = new Float32Array(N*3);

const sheetGeo = new THREE.BufferGeometry();
const posAttr = new THREE.BufferAttribute(new Float32Array(N*3), 3);
const nrmAttr = new THREE.BufferAttribute(new Float32Array(N*3), 3);
const uvAttr  = new THREE.BufferAttribute(new Float32Array(N*2), 2);
sheetGeo.setAttribute('position', posAttr);
sheetGeo.setAttribute('normal', nrmAttr);
sheetGeo.setAttribute('uv', uvAttr);
{
  const uvs = uvAttr.array;
  for(let j=0;j<NY;j++) for(let i=0;i<NX;i++){
    const k = j*NX+i;
    uvs[k*2] = i/(NX-1); uvs[k*2+1] = j/(NY-1);
  }
}
const idxA = new Uint16Array((NX-1)*(NY-1)*6);
const idxB = new Uint16Array((NX-1)*(NY-1)*6);
{
  let a=0,b=0;
  for(let j=0;j<NY-1;j++) for(let i=0;i<NX-1;i++){
    const p = j*NX+i, q = p+1, r = p+NX, s = r+1;
    idxA[a++]=p; idxA[a++]=r; idxA[a++]=q;
    idxA[a++]=q; idxA[a++]=r; idxA[a++]=s;
    idxB[b++]=p; idxB[b++]=q; idxB[b++]=r;
    idxB[b++]=q; idxB[b++]=s; idxB[b++]=r;
  }
}
const idxAttrA = new THREE.BufferAttribute(idxA, 1);
const idxAttrB = new THREE.BufferAttribute(idxB, 1);
sheetGeo.setIndex(idxAttrA);

const sheetUni = {
  texA:{value:null}, texB:{value:null},
  flipA:{value:0}, flipB:{value:1},
  shade:{value:shadeTex},
  light:{value:LIGHT.clone()},
  ambient:{value:0.385}, diffuse:{value:0.712},
  showThrough:{value:0.10},
  bookSize:{value:new THREE.Vector2(BOOK_W, BOOK_H)},
  opacity:{value:1}
};

const sheetMat = new THREE.ShaderMaterial({
  uniforms: sheetUni,
  side: THREE.DoubleSide,
  transparent: true,
  vertexShader:\`
    varying vec2 vUvP;
    varying vec3 vN;
    varying vec3 vW;
    void main(){
      vUvP = uv;
      vN = normalize(normalMatrix * normal);
      vec4 wp = modelMatrix * vec4(position,1.0);
      vW = wp.xyz;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }\`,
  fragmentShader:\`
    precision highp float;
    uniform sampler2D texA, texB, shade;
    uniform float flipA, flipB, ambient, diffuse, showThrough, opacity;
    uniform vec3 light;
    uniform vec2 bookSize;
    varying vec2 vUvP;
    varying vec3 vN;
    varying vec3 vW;
    vec3 toS(vec3 c){ return mix(c*12.92, 1.055*pow(max(c,0.0), vec3(0.41666))-0.055, step(vec3(0.0031308), c)); }
    vec3 toL(vec3 c){ return mix(c/12.92, pow((c+0.055)/1.055, vec3(2.4)), step(vec3(0.04045), c)); }
    void main(){
      vec2 ua = vec2(mix(vUvP.x, 1.0-vUvP.x, flipA), vUvP.y);
      vec2 ub = vec2(mix(vUvP.x, 1.0-vUvP.x, flipB), vUvP.y);
      vec4 ca = texture2D(texA, ua);
      vec4 cb = texture2D(texB, ub);
      bool front = gl_FrontFacing;
      vec3 face  = front ? ca.rgb : cb.rgb;
      vec3 other = front ? cb.rgb : ca.rgb;

      float ink = dot(other, vec3(0.333));

      vec3 n = normalize(vN);
      if(!front) n = -n;
      float nl = max(dot(n, light), 0.0);
      float lum = ambient + diffuse * nl;
      vec3 V = vec3(0.0,0.0,1.0);
      vec3 H = normalize(light + V);
      lum += pow(max(dot(n,H),0.0), 40.0) * 0.05;
      lum += (1.0 - abs(dot(n, vec3(0.0,0.0,1.0)))) * 0.02;

      float h = vW.z;
      float contact = 1.0 - smoothstep(2.0, 150.0, h);
      // a leaf held up to the light shows the far side; one lying on the block does not
      face += showThrough * (1.0 - contact) * clamp(ink*1.6, 0.0, 1.0);

      vec2 suv = vec2(vW.x/bookSize.x + 0.5, vW.y/bookSize.y + 0.5);
      vec4 sh = texture2D(shade, suv);
      float inBook = step(0.0, suv.x)*step(suv.x,1.0)*step(0.0,suv.y)*step(suv.y,1.0);

      vec3 col = face * lum * (1.0 + 0.05*(1.0 - contact));
      vec3 sc = toS(col);
      sc = mix(sc, toS(sh.rgb), sh.a * contact * inBook);
      col = toL(sc);

      gl_FragColor = vec4(col, opacity);
      #include <colorspace_fragment>
    }\`
});
const sheet = new THREE.Mesh(sheetGeo, sheetMat);
sheet.renderOrder = 5;
sheet.frustumCulled = false;
sheet.visible = false;
book.add(sheet);

/* ---- projected soft contact shadow ---- */
const SH_TAPS = 28;
const shadowGeo = new THREE.InstancedBufferGeometry();
shadowGeo.index = sheetGeo.index;
shadowGeo.setAttribute('position', posAttr);
shadowGeo.instanceCount = SH_TAPS;
{
  const j = new Float32Array(SH_TAPS*2);
  const ga = 2.399963;
  for(let i=0;i<SH_TAPS;i++){
    const r = Math.sqrt((i+0.5)/SH_TAPS), a = i*ga;
    j[i*2] = Math.cos(a)*r; j[i*2+1] = Math.sin(a)*r;
  }
  shadowGeo.setAttribute('jit', new THREE.InstancedBufferAttribute(j, 2));
}
const shadowUni = {
  light:{value:LIGHT.clone()},
  strength:{value:0.011},
  bookSize:{value:new THREE.Vector2(BOOK_W, BOOK_H)}
};
const shadowMat = new THREE.ShaderMaterial({
  uniforms: shadowUni,
  transparent:true, depthWrite:false, depthTest:false,
  side: THREE.DoubleSide,
  vertexShader:\`
    attribute vec2 jit;
    uniform vec3 light;
    varying float vFade;
    varying vec2 vXY;
    void main(){
      vec3 p = position;
      float h = max(p.z, 0.0);
      vec3 pr = p - light * (p.z / max(light.z, 0.15));
      pr.xy += jit * (h * 0.75 + 10.0);
      pr.z = 2.6;
      vFade = 1.0 - smoothstep(0.0, 250.0, h);
      vXY = pr.xy;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pr,1.0);
    }\`,
  fragmentShader:\`
    precision highp float;
    uniform float strength;
    uniform vec2 bookSize;
    varying float vFade;
    varying vec2 vXY;
    void main(){
      vec2 q = abs(vXY) / (bookSize*0.5);
      float clip = (1.0 - smoothstep(0.965, 1.0, max(q.x,q.y)));
      gl_FragColor = vec4(0.0,0.0,0.0, strength * vFade * vFade * clip);
    }\`
});
const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
shadowMesh.renderOrder = 3;
shadowMesh.frustumCulled = false;
shadowMesh.visible = false;
book.add(shadowMesh);

/* ═══════════════════════════════════════════════════════════════
   8.  PAGE-CURL DEFORMATION
   ------------------------------------------------------------------
   The leaf wraps onto a cylinder of radius R whose axis — the fold
   line, tilted by phi and a distance f from the spine — sweeps across
   the paper.  Material before the line stays flat on the open spread;
   material after it rolls up, over, and travels back across the book
   at height 2R, mirrored about the line.
   ═══════════════════════════════════════════════════════════════ */
const RMIN = 0.15, RMAX = 538, PHI = 0.215, DROOP = 0.70, DROOP_T = 0.30;

let side = 1;
let grabU = 0.84, grabV = 0.085;
let tiltSign = 1;
const yMid = (PAGE_TOP_Y + PAGE_BOT_Y)/2;

function resetSheet(s){
  side = s;
  for(let j=0;j<NY;j++){
    const v = j/(NY-1);
    const y = PAGE_BOT_Y + v*(PAGE_TOP_Y - PAGE_BOT_Y);
    for(let i=0;i<NX;i++){
      const k = (j*NX+i)*3;
      rest[k]   = (i/(NX-1))*PAGE_W;
      rest[k+1] = y;
      rest[k+2] = 0;
    }
  }
  const ia = side>0 ? idxAttrB : idxAttrA;
  sheetGeo.setIndex(ia);
  shadowGeo.index = ia;
}

const CP = {f:0, R:RMIN, cs:1, sn:0};
function curlParams(k, wob){
  k = Math.min(1, Math.max(0, k));
  const bell = Math.sin(Math.PI*k);
  let R = RMIN + RMAX * Math.pow(k, 1.3) * Math.pow(1 - k, 0.55);
  if(R < RMIN) R = RMIN;
  let phi = tiltSign * PHI * Math.sqrt(bell);
  if(wob){ R *= (1 + wob*0.16); phi += wob*0.05*tiltSign; }
  CP.f  = PAGE_W*(1-k);
  CP.R  = R;
  CP.cs = Math.cos(phi);
  CP.sn = Math.sin(phi);
}

const _p = [0,0,0];
let ripA = 0, ripPh = 0;
function deform(a, b){
  const {f, R, cs, sn} = CP;
  const dx = a - f, dy = b - yMid;
  const s  = dx*cs - dy*sn;
  const t  = dx*sn + dy*cs;
  let sp, z;
  if(s <= 0){ sp = s; z = 0; }
  else {
    const th = s/R;
    if(th <= Math.PI){ sp = R*Math.sin(th); z = R*(1 - Math.cos(th)); }
    else {
      const e = s - Math.PI*R, en = e/PAGE_W, tn = t/(PAGE_H*0.5);
      sp = -e;
      z  = 2*R - DROOP*R*en*en - DROOP_T*R*en*tn*tn;
    }
  }
  if(ripA > 0){
    const u = a/PAGE_W;
    z += ripA * u * Math.max(0, Math.sin(ripPh - u*4.2));
  }
  if(z < 0) z = 0;
  _p[0] = side*(f + sp*cs + t*sn);
  _p[1] = yMid - sp*sn + t*cs;
  _p[2] = z + 2.2;
  return _p;
}

function applyCurl(k, wob, rip){
  curlParams(k, wob);
  ripA = rip ? rip.a : 0;
  ripPh = rip ? rip.ph : 0;
  for(let j=0;j<NY;j++){
    for(let i=0;i<NX;i++){
      const o = (j*NX+i)*3;
      const q = deform(rest[o], rest[o+1]);
      pos[o] = q[0]; pos[o+1] = q[1]; pos[o+2] = q[2];
    }
  }
}

function updateGeometry(){
  const P = posAttr.array, Nm = nrmAttr.array;
  P.set(pos);
  for(let j=0;j<NY;j++) for(let i=0;i<NX;i++){
    const k = j*NX+i, o = k*3;
    const il = i>0 ? k-1 : k, ir = i<NX-1 ? k+1 : k;
    const jd = j>0 ? k-NX : k, ju = j<NY-1 ? k+NX : k;
    const ax = pos[ir*3]-pos[il*3], ay = pos[ir*3+1]-pos[il*3+1], az = pos[ir*3+2]-pos[il*3+2];
    const bx = pos[ju*3]-pos[jd*3], by = pos[ju*3+1]-pos[jd*3+1], bz = pos[ju*3+2]-pos[jd*3+2];
    let nx = ay*bz-az*by, ny = az*bx-ax*bz, nz = ax*by-ay*bx;
    const L = Math.hypot(nx,ny,nz) || 1;
    const sg = side > 0 ? 1 : -1;
    Nm[o] = sg*nx/L; Nm[o+1] = sg*ny/L; Nm[o+2] = sg*nz/L;
  }
  posAttr.needsUpdate = true;
  nrmAttr.needsUpdate = true;
  sheetGeo.computeBoundingSphere();
}

/* ═══════════════════════════════════════════════════════════════
   9.  BOOK STATE
   ═══════════════════════════════════════════════════════════════ */
let PAGES = [];
let spread = 1;                 // which pair of leaves is mounted
let viewPage = 3;               // which single page is framed (narrow layout)
let turn = null;
let fade = null;
let single = false;

function spreadCount(){ return PAGES.length/2; }
function isRecto(p){ return (p % 2) === 1; }

function applyBase(){
  leftPage.material.map  = pageTex(spread*2);
  rightPage.material.map = pageTex(spread*2+1);
  leftPage.material.needsUpdate = true;
  rightPage.material.needsUpdate = true;
  drawShade((spread*2)/PAGES.length);
  updateChrome();
  prefetch();
}

let prefetchTimer = null;
function prefetch(){
  clearTimeout(prefetchTimer);
  const want = [spread*2+2, spread*2+3, spread*2-1]
                 .filter(i => i >= 0 && i < PAGES.length);
  let i = 0;
  const run = () => {
    if(i >= want.length || turn) return;
    pageTex(want[i++]);
    prefetchTimer = setTimeout(run, 24);
  };
  prefetchTimer = setTimeout(run, 90);
}

function beginTurn(dir, mode){
  if(turn) return false;
  if(dir > 0 && spread >= spreadCount()-1) return false;
  if(dir < 0 && spread <= 0) return false;

  const front = dir > 0 ? spread*2+1 : spread*2-1;   // recto of the leaf
  const back  = front + 1;                            // verso of the leaf

  if(dir > 0){
    leftPage.material.map  = pageTex(spread*2);
    rightPage.material.map = pageTex(spread*2+3);
  } else {
    leftPage.material.map  = pageTex(spread*2-2);
    rightPage.material.map = pageTex(spread*2+1);
  }
  leftPage.material.needsUpdate = true;
  rightPage.material.needsUpdate = true;

  const tf = pageTex(front), tb = pageTex(back);
  if(dir > 0){
    sheetUni.texA.value = tf; sheetUni.flipA.value = 0;
    sheetUni.texB.value = tb; sheetUni.flipB.value = 1;
  } else {
    sheetUni.texA.value = tb; sheetUni.flipA.value = 1;
    sheetUni.texB.value = tf; sheetUni.flipB.value = 0;
  }

  tiltSign = (grabV < 0.5 ? 1 : -1);
  resetSheet(dir > 0 ? 1 : -1);
  applyCurl(0, 0, null); updateGeometry();
  sheet.visible = true;
  shadowMesh.visible = true;
  turn = {dir, mode, k:0, target:0, t:0, T:0.9, from:0, commit:true, settling:false, st:0, vk:0,
          camFrom: camX, camTo: camX};

  // in the narrow layout the eye travels with the leaf across the gutter
  if(single){
    setView(dir > 0 ? (spread+1)*2 : (spread-1)*2+1, true);
    turn.camTo = camTarget;
  }
  return true;
}

function finishTurn(){
  spread += turn.dir;
  turn = null;
  if(!single) viewPage = spread*2;
  applyBase();
  fade = 0;
}
function cancelTurn(){
  const d = turn.dir;
  turn = null;
  if(!single) viewPage = spread*2;
  applyBase();
  if(single) setView(d > 0 ? spread*2+1 : spread*2, true);
  fade = 0;
}

/* ═══════════════════════════════════════════════════════════════
   10. NAVIGATION
   ═══════════════════════════════════════════════════════════════ */
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
let pendingDir = 0;
let camX = 0, camTarget = 0;

function setView(p, keepSpread){
  viewPage = Math.max(0, Math.min(PAGES.length-1, p));
  if(!keepSpread){
    const sp = Math.floor(viewPage/2);
    if(sp !== spread){ spread = sp; applyBase(); }
  }
  camTarget = single ? (isRecto(viewPage) ? PAGE_W/2 : -PAGE_W/2) : 0;
  updateChrome();
}

function autoTurn(dir){
  if(!PAGES.length) return;
  if(turn){ pendingDir = dir; return; }
  grabU = 0.86; grabV = 0.09;
  if(!beginTurn(dir, 'auto')) return;
  turn.mode = 'auto'; turn.commit = true; turn.from = 0;
  turn.T = REDUCED ? 0.34 : 0.9; turn.t = 0;
}

/* one step forward or back — a leaf turn, or a look across the gutter */
function go(dir){
  if(!PAGES.length) return;
  if(!single){ autoTurn(dir); return; }
  if(turn){ pendingDir = dir; return; }
  if(dir > 0){
    if(!isRecto(viewPage) && viewPage + 1 < PAGES.length) setView(viewPage + 1);
    else autoTurn(1);
  } else {
    if(isRecto(viewPage) && viewPage > 0) setView(viewPage - 1);
    else autoTurn(-1);
  }
}

function jumpTo(pageIndex){
  const p = Math.max(0, Math.min(PAGES.length-1, pageIndex));
  spread = Math.floor(p/2);
  viewPage = p;
  applyBase();
  camTarget = single ? (isRecto(viewPage) ? PAGE_W/2 : -PAGE_W/2) : 0;
}

/* ═══════════════════════════════════════════════════════════════
   11. CHROME
   ═══════════════════════════════════════════════════════════════ */
const elDot = document.getElementById('dot');
const elLabel = document.getElementById('label');
const elTrack = document.getElementById('track');
const elPrev = document.getElementById('prev');
const elNext = document.getElementById('next');
const elRing = document.getElementById('ring');
const stageEl = document.getElementById('stage');

function updateChrome(){
  if(!PAGES.length) return;
  if(single){
    elLabel.textContent = String(viewPage);
    elDot.style.left = (viewPage/(PAGES.length-1)*100) + '%';
    elPrev.disabled = viewPage <= 0;
    elNext.disabled = viewPage >= PAGES.length-1;
  } else {
    const a = spread*2;
    elLabel.textContent = \`\${a}–\${a+1}\`;
    const f = spreadCount() > 1 ? spread/(spreadCount()-1) : 0;
    elDot.style.left = (f*100) + '%';
    elPrev.disabled = spread <= 0;
    elNext.disabled = spread >= spreadCount()-1;
  }
}

elPrev.onclick = () => go(-1);
elNext.onclick = () => go(+1);
document.getElementById('back').onclick = () => {
  stageEl.classList.add('leaving');
  setTimeout(() => stageEl.classList.remove('leaving'), 1100);
};

let trackDrag = false;
elTrack.addEventListener('pointerdown', e => {
  trackDrag = true; elTrack.setPointerCapture(e.pointerId); scrubTo(e);
});
elTrack.addEventListener('pointermove', e => { if(trackDrag) scrubTo(e); });
elTrack.addEventListener('pointerup', () => { trackDrag = false; });
function scrubTo(e){
  if(turn) return;
  const r = elTrack.getBoundingClientRect();
  const f = Math.max(0, Math.min(1, (e.clientX - r.left)/r.width));
  if(single){
    const p = Math.round(f*(PAGES.length-1));
    if(p === viewPage) return;
    if(Math.abs(p - viewPage) === 1) go(p > viewPage ? 1 : -1);
    else jumpTo(p);
  } else {
    const s = Math.round(f*(spreadCount()-1));
    if(s === spread) return;
    if(Math.abs(s - spread) === 1) go(s > spread ? 1 : -1);
    else jumpTo(s*2);
  }
}

addEventListener('keydown', e => {
  if(e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown'){ go(+1); e.preventDefault(); }
  if(e.key === 'ArrowLeft'  || e.key === 'PageUp'){ go(-1); e.preventDefault(); }
  if(e.key === 'Home'){ jumpTo(0); e.preventDefault(); }
  if(e.key === 'End'){ jumpTo(PAGES.length-1); e.preventDefault(); }
});

/* ═══════════════════════════════════════════════════════════════
   12. POINTER
   ═══════════════════════════════════════════════════════════════ */
let scale = 1, uiScale = 1;
function screenToBook(cx, cy){
  const x = (cx - innerWidth/2)/scale + camX;
  const y = -(cy - innerHeight/2)/scale - BOOK_OFF_Y;
  return {x, y};
}

let dragging = false, gesture = 'none';
let clickMove = 0, downX = 0, downY = 0, panFrom = 0;

canvas.addEventListener('pointerdown', e => {
  downX = e.clientX; downY = e.clientY; clickMove = 0;
  if(turn || fade !== null) return;
  const p = screenToBook(e.clientX, e.clientY);
  // forgiving on touch: anywhere over the boards counts, the grab is clamped to the leaf
  if(p.y > BOOK_H/2 || p.y < -BOOK_H/2) return;
  if(Math.abs(p.x) > PAGE_W + BOARD) return;
  dragging = true;
  gesture = single ? 'undecided' : 'curl';
  canvas.setPointerCapture(e.pointerId);
  ring(e.clientX, e.clientY, true);
  if(!single){
    const dir = p.x >= 0 ? 1 : -1;
    grabU = Math.min(0.99, Math.max(0.16, Math.abs(p.x)/PAGE_W));
    grabV = Math.min(0.97, Math.max(0.03, (p.y - PAGE_BOT_Y)/PAGE_H));
    if(!beginTurn(dir, 'drag')){ dragging = false; gesture = 'none'; return; }
    document.body.classList.add('grabbing');
  }
});

canvas.addEventListener('pointermove', e => {
  ringMove(e.clientX, e.clientY);
  clickMove = Math.max(clickMove, Math.hypot(e.clientX - downX, e.clientY - downY));
  if(!dragging) return;

  if(gesture === 'undecided'){
    const dx = e.clientX - downX;
    if(Math.abs(dx) < 8) return;
    const wantDir = dx < 0 ? 1 : -1;                  // drag left = onward
    const needsTurn = wantDir > 0 ? isRecto(viewPage) : !isRecto(viewPage);
    if(needsTurn){
      const p = screenToBook(downX, downY);
      grabU = Math.min(0.99, Math.max(0.16, Math.abs(p.x)/PAGE_W));
      grabV = Math.min(0.97, Math.max(0.03, (p.y - PAGE_BOT_Y)/PAGE_H));
      if(beginTurn(wantDir, 'drag')){
        gesture = 'curl';
        document.body.classList.add('grabbing');
      } else { dragging = false; gesture = 'none'; return; }
    } else {
      gesture = 'pan';
      panFrom = camX;
      document.body.classList.add('panning');
    }
  }

  if(gesture === 'curl'){
    if(!turn) return;
    const p = screenToBook(e.clientX, e.clientY);
    // travel-based: pulling the leaf across to the far margin completes the turn
    const span = grabU*PAGE_W + PAGE_W*0.80;
    const start = turn.dir * grabU * PAGE_W;
    turn.target = Math.max(0, Math.min(1, turn.dir*(start - p.x) / span));
  } else if(gesture === 'pan'){
    const dx = (e.clientX - downX)/scale;
    camTarget = Math.max(-PAGE_W/2, Math.min(PAGE_W/2, panFrom - dx));
    camX = camTarget;
  }
});

function endDrag(){
  if(!dragging) return;
  dragging = false;
  document.body.classList.remove('grabbing','panning');
  ring(0,0,false);
  const g = gesture; gesture = 'none';

  if(g === 'pan'){
    const home = isRecto(viewPage) ? PAGE_W/2 : -PAGE_W/2;
    const dx = camX - home;
    if(Math.abs(dx) > PAGE_W*0.14) go(dx > 0 ? 1 : -1);
    else camTarget = home;
    return;
  }
  if(g === 'undecided'){
    if(clickMove < 7){                                // a tap
      const p = screenToBook(downX, downY);
      go(p.x >= camX ? 1 : -1);
    }
    return;
  }
  if(!turn) return;
  turn.mode = 'auto';
  turn.t = 0;
  turn.from = turn.k;
  const tap = clickMove < 7;
  const flick = turn.vk > 1.1;
  if(tap || flick || turn.k > 0.45){
    turn.commit = true;
    turn.T = tap ? (REDUCED ? 0.34 : 0.9) : (0.20 + 0.55*(1 - turn.k));
  } else {
    turn.commit = false; turn.T = 0.15 + 0.40*turn.k;
  }
}
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);

let wheelAcc = 0, wheelLock = 0;
canvas.addEventListener('wheel', e => {
  const now = performance.now();
  if(now < wheelLock) return;
  wheelAcc += (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY);
  if(Math.abs(wheelAcc) > 90){
    go(wheelAcc > 0 ? 1 : -1);
    wheelAcc = 0; wheelLock = now + 380;
  }
  e.preventDefault();
}, {passive:false});

function ring(x,y,on){
  if(on){ elRing.style.left = x+'px'; elRing.style.top = y+'px'; elRing.classList.add('on'); }
  else elRing.classList.remove('on');
}
function ringMove(x,y){
  if(elRing.classList.contains('on')){ elRing.style.left = x+'px'; elRing.style.top = y+'px'; }
}

/* ═══════════════════════════════════════════════════════════════
   13. LAYOUT / LOOP
   ═══════════════════════════════════════════════════════════════ */
const SPREAD_FRAME_W = BOOK_W * 1.08;              // 2387
const SINGLE_FRAME_W = (PAGE_W + MARG*2) * 1.10;   // 1247
let lastGlowCam = -999;

function chooseLayout(){
  // a pane can hand us a zero-sized viewport before it settles
  const vw = Math.max(320, innerWidth), vh = Math.max(320, innerHeight);
  const spreadScale = Math.min(vw/SPREAD_FRAME_W, vh/FR_H);
  const singleScale = Math.min(vw/SINGLE_FRAME_W, vh/FR_H);
  // one page at a time when the viewport is portrait, or when a spread would
  // squeeze the type and showing a single leaf genuinely buys room
  const wantSingle = (vw/vh < 1.0) ||
                     (spreadScale * BODY_BASE < MIN_PX && singleScale > spreadScale * 1.12);
  return { single: wantSingle, scale: wantSingle ? singleScale : spreadScale };
}

function resize(){
  const vw = Math.max(1, innerWidth), vh = Math.max(1, innerHeight);
  const L = chooseLayout();
  const modeChanged = L.single !== single;
  single = L.single;
  scale  = Math.max(0.05, L.scale);
  uiScale = Math.max(scale, Math.min(0.46, vh/1400, vw/1500));

  document.documentElement.style.setProperty('--s', scale);
  document.documentElement.style.setProperty('--u', uiScale);
  document.documentElement.style.setProperty('--bw', BOOK_W);
  document.documentElement.style.setProperty('--bh', BOOK_H);
  document.documentElement.style.setProperty('--br', COVER_R);

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(vw, vh, false);
  camera.aspect = vw/vh;
  camera.position.z = (vh/scale) / (2*Math.tan(FOV*Math.PI/360));
  camera.updateProjectionMatrix();

  // body type never renders below MIN_PX — the book repaginates instead
  const wantTS = Math.min(3, Math.max(1, (MIN_PX/scale) / BODY_BASE));
  const tsChanged = Math.abs(wantTS - TS) > 0.004;
  const nq = Math.max(0.85, Math.min(1.8, scale*Math.min(devicePixelRatio,2)));
  const qChanged = Math.abs(nq - TQ) > 0.12;

  if(!PAGES.length){ applyMetrics(wantTS); TQ = nq; return; }

  if(tsChanged){
    const mark = PAGES[viewPage] ? PAGES[viewPage].mark : undefined;
    applyMetrics(wantTS);
    PAGES = paginate();
    window.__PAGES = PAGES;
    if(qChanged) TQ = nq;
    initPool();
    let p = Math.min(viewPage, PAGES.length-1);
    if(mark !== undefined){
      let best = 0;
      for(let i=0;i<PAGES.length;i++) if(PAGES[i].mark !== undefined && PAGES[i].mark <= mark) best = i;
      p = best;
    }
    jumpTo(p);
  } else if(qChanged){
    TQ = nq; initPool(); applyBase();
  }

  if(modeChanged || tsChanged || qChanged){
    camTarget = single ? (isRecto(viewPage) ? PAGE_W/2 : -PAGE_W/2) : 0;
    camX = camTarget;
    applyBase();
  }
  updateChrome();
}
let resizeTimer = null;
addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resize, 120);
});

let last = performance.now();
let paused = false;
function frame(now){
  requestAnimationFrame(frame);
  let dt = Math.min(0.033, (now - last)/1000);
  last = now;
  if(paused) return;
  step(dt);
}

function step(dt){
  if(turn){
    if(turn.mode === 'auto'){
      turn.t += dt;
      const p = Math.min(1, turn.t/turn.T);
      const e = 1 - Math.pow(1 - Math.pow(p, 1.08), 3.0);
      const to = turn.commit ? 1 : 0;
      turn.target = turn.from + (to - turn.from)*e;
      if(p >= 1) turn.settling = true;
    }
    const k0 = turn.k;
    turn.k += (turn.target - turn.k) * Math.min(1, dt*22);
    const inst = dt > 0 ? (turn.k - k0)/dt : 0;
    turn.vk = turn.vk*0.7 + inst*0.3;

    let wob = 0, rip = null;
    if(turn.settling){
      turn.st += dt;
      rip = REDUCED ? null : { a: 30 * Math.exp(-turn.st*9.0), ph: turn.st*20.0 };
      if(turn.st > 0.26){
        if(turn.commit) finishTurn(); else cancelTurn();
      }
    } else if(turn.mode === 'auto' && turn.commit){
      wob = Math.sin(turn.t*13.0) * 0.045 * Math.sin(Math.PI*Math.min(1,turn.k));
    }
    if(turn){ applyCurl(turn.k, wob, rip); updateGeometry(); }
  }

  if(fade !== null){
    fade += dt;
    const a = 1 - fade/0.10;
    if(a <= 0){
      fade = null; sheet.visible = false; sheetUni.opacity.value = 1;
      if(pendingDir){ const d = pendingDir; pendingDir = 0; go(d); }
    } else sheetUni.opacity.value = a;
  }

  // camera pan (narrow layout) — during a turn it rides with the leaf
  if(single && turn && turn.camFrom !== turn.camTo){
    const e = turn.k*turn.k*(3 - 2*turn.k);
    camX = turn.camFrom + (turn.camTo - turn.camFrom)*e;
  } else if(Math.abs(camTarget - camX) > 0.05){
    camX += (camTarget - camX) * Math.min(1, dt*8.5);
  } else camX = camTarget;
  camera.position.x = camX;
  const gc = Math.round(camX*scale*10)/10;
  if(gc !== lastGlowCam){
    lastGlowCam = gc;
    document.documentElement.style.setProperty('--camx', gc + 'px');
  }

  updateVeil();
  shadowMesh.visible = sheet.visible && fade === null;
  renderer.render(scene, camera);
}

window.__dbg = {
  step, autoTurn, go, jumpTo,
  pause(v){ paused = v; },
  turn: ()=>turn,
  setGrab(u,v){ grabU=u; grabV=v; },
  state: ()=>({spread, viewPage, single, scale:+scale.toFixed(4), TS:+TS.toFixed(3),
               bodyPx:+(bodySize*scale).toFixed(2), pages:PAGES.length, maxLines:MAX_LINES}),
  hy: (w)=>hyphenPoints(w),
  params: ()=>({...CP})
};

/* ═══════════════════════════════════════════════════════════════
   14. BOOT
   ═══════════════════════════════════════════════════════════════ */
function warmShaders(){
  resetSheet(1);
  applyCurl(0.35, 0, null);
  updateGeometry();
  sheetUni.texA.value = pageTex(2);
  sheetUni.texB.value = pageTex(3);
  sheetUni.opacity.value = 0.001;
  sheet.visible = true; shadowMesh.visible = true;
  renderer.render(scene, camera);
  sheet.visible = false; shadowMesh.visible = false;
  sheetUni.opacity.value = 1;
}

async function boot(){
  try{
    await document.fonts.ready;
    await Promise.all([
      document.fonts.load(\`300 \${BODY_BASE}px Spectral\`),
      document.fonts.load(\`400 \${BODY_BASE}px Spectral\`),
      document.fonts.load(\`600 84px Spectral\`),
      document.fonts.load(\`italic 400 \${BODY_BASE}px Spectral\`),
      document.fonts.load(\`400 20px "PT Sans"\`),
      document.fonts.load(\`700 20px "PT Sans"\`)
    ]);
  }catch(err){ /* offline: system fallbacks */ }

  resize();                       // sets scale + metrics before typesetting
  PAGES = paginate();
  window.__PAGES = PAGES;
  TQ = Math.max(0.85, Math.min(1.8, scale*Math.min(devicePixelRatio,2)));
  initPool();
  jumpTo(2);
  camX = camTarget;
  warmShaders();
  document.getElementById('boot').classList.add('gone');
  requestAnimationFrame(frame);
}
boot();
<\/script>
</body>
</html>
`;function b({className:o="",style:l}){const i=e.useRef(null),[d,c]=e.useState(()=>typeof document>"u"||!document.hidden),[p,u]=e.useState(!0),[n,s]=e.useState(!1);e.useEffect(()=>{const t=i.current;if(!t||typeof IntersectionObserver>"u")return;const r=new IntersectionObserver(([g])=>{u(g?.isIntersecting??!0)},{rootMargin:"80px"});return r.observe(t),()=>r.disconnect()},[]),e.useEffect(()=>{if(typeof document>"u")return;const t=()=>c(!document.hidden);return document.addEventListener("visibilitychange",t),()=>document.removeEventListener("visibilitychange",t)},[]);const a=p&&d;return e.useEffect(()=>{s(!1)},[a]),h.jsx("div",{ref:i,className:`threeui-background book-of-tea${o?` ${o}`:""}`,role:"group","aria-label":"Interactive Book of Japan reader","data-state":a?n?"ready":"loading":"paused",style:{background:"#090a0c",pointerEvents:"auto",...l},children:a?h.jsx("iframe",{title:"The Book of Japan — Reader",srcDoc:f,sandbox:"allow-scripts",loading:"eager",onLoad:()=>s(!0),style:{position:"absolute",inset:0,display:"block",width:"100%",height:"100%",border:0,background:"#090a0c",opacity:n?1:0,pointerEvents:n?"auto":"none",transition:"opacity 240ms ease-out"}}):null})}export{b as BookOfTea};
