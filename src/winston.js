// Manages a list of buffers.
// Currently a global singleton. Dependencies are IoC'd to not program directly
// again this. Can refactor to class when the product involves having multiple
// sets of buffers.
function $WINSTON(winstonContainerId = 'aside-details-buffers') {
  const el = $(`#${winstonContainerId}`)[0];
  let buffers = {
    0: [
      "From my grandfather Verus I learned good morals and the government of my temper.",
      "From the reputation and remembrance of my father, modesty and a manly character.",
      "From my mother, piety and beneficence, and abstinence, not only from evil deeds, but even",
      "From my great-grandfather, not to have frequented public schools, and to have had good teache",
      "From my governor, to be neither of the green nor of the blue party at the games in the Circus, nor",
      "a partizan either of the Parmularius or the Scutarius at the gladiators' fights; from him too I learned endurance of labour,",
      "and to want little, and to work with my own hands, and not to meddle with other people's affairs, and not to be ready to listen to slander.",
      "From Diognetus, not to busy myself about trifling things, and not to give credit to what was said by miracle-workers",
      "and jugglers about incantations and the driving away of daemons and such things; and not to breed quails for fighting, nor to give myself up passionately",
      "to such things; and to endure freedom of speech; and to have become intimate with philosophy; and to have been a hearer, first of Bacchius, then",
      "of Tandasis and Marcianus; and to have written dialogues in my youth;",
    ],
    1: [
      "'ve got sunshine on a cloudy day.",
      "When it's cold outside I've got the month of May.",
      "I guess you'd say",
      "What can make me feel this way?",
      "My girl (my girl, my girl)",
      "Talkin' 'bout my girl (my girl).",
      "I've got so much honey the bees envy me.",
      "I've got a sweeter song than the birds in the trees.",
      "I guess you'd say",
      "What can make me feel this way?",
      "My girl (my girl, my girl)",
      "Talkin' 'bout my girl (my girl).",
      "Hey hey hey",
      "Hey hey hey",
      "Ooooh.",
      "I don't need no money, fortune, or fame.",
      "I've got all the riches baby one man can claim.",
      "I guess you'd say",
      "What can make me feel this way?",
      "My girl (my girl, my girl)",
      "Talkin' 'bout my girl (my girl).",
      "I've got sunshine on a cloudy day",
      "with my girl.",
      "I've even got the month of May",
      "with my girl (fade)",
      ""
    ],
    2: [
      "# https://github.com/chrislgarry/Apollo-11/blob/master/Luminary099/CONTROLLED_CONSTANTS.agc",
      "# Copyright:\tPublic domain.",
      "# Filename:\tCONTROLLED_CONSTANTS.agc",
      "# Purpose:\tPart of the source code for Luminary 1A build 099.",
      "#\t\tIt is part of the source code for the Lunar Module's (LM)",
      "#\t\tApollo Guidance Computer (AGC), for Apollo 11.",
      "#",
      "# Assembler:\tyaYUL",
      "# Contact:\tJim Lawton <jim.lawton@gmail.com>",
      "# Website:\twww.ibiblio.org/apollo.",
      "# Pages:\t038-053",
      "# Mod history:\t2009-05-16\tJVL\tTranscribed from page images.",
      "#",
      "# This source code has been transcribed or otherwise adapted from digitized",
      "# images of a hardcopy from the MIT Museum.  The digitization was performed",
      "# by Paul Fjeld, and arranged for by Deborah Douglas of the Museum.  Many",
      "# thanks to both.  The images (with suitable reduction in storage size and",
      "# consequent reduction in image quality as well) are available online at",
      "# www.ibiblio.org/apollo.  If for some reason you find that the images are",
      "# illegible, contact me at info@sandroid.org about getting access to the",
      "# (much) higher-quality images which Paul actually created.",
      "#",
      "# Notations on the hardcopy document read, in part:",
      "#",
      "#    Assemble revision 001 of AGC program LMY99 by NASA 2021112-061",
      "#    16:27 JULY 14, 1969",
      "",
      "# Page 38",
      "# DPS AND APS ENGINE PARAMETERS",
      "",
      "\t\tSETLOC\tP40S",
      "\t\tBANK",
      "\t\tCOUNT*\t$$/P40",
      "",
      "# *** THE ORDER OF THE FOLLOWING SIX CONSTANTS MUST NOT BE CHANGED ***",
      "",
      "FDPS\t\t2DEC\t4.3670 B-7\t\t# 9817.5 LBS FORCE IN NEWTONS",
      "MDOTDPS\t\t2DEC\t0.1480 B-3\t\t# 32.62 LBS/SEC IN KGS/CS",
      "DTDECAY\t\t2DEC\t-38",
      "FAPS\t\t2DEC\t1.5569 B-7\t\t# 3500 LBS FORCE IN NEWTONS",
      "MDOTAPS\t\t2DEC\t0.05135 B-3\t\t# 11.32 LBS/SEC IN KGS/CS",
      "ATDECAY\t\t2DEC\t-10",
      "",
      "# ********************************************************************",
      "",
      "FRCS4\t\t2DEC\t0.17792 B-7\t\t# 400 LBS FORCE IN NEWTONS",
      "FRCS2\t\t2DEC\t0.08896 B-7\t\t# 200 LBS FORCE IN NEWTONS",
      "",
      "\t\tSETLOC\tP40S1",
      "\t\tBANK",
      "\t\tCOUNT*\t$$/P40",
      "",
      "# *** APS IMPULSE DATA FOR P42 ***************************************",
      "",
      "K1VAL\t\t2DEC\t124.55 B-23\t\t# 2800 LB-SEC",
      "K2VAL\t\t2DEC\t31.138 B-24\t\t# 700 LB-SEC",
      "K3VAL\t\t2DEC\t1.5569 B-10\t\t# FAPS (3500 LBS THRUST)",
      "",
      "# ********************************************************************",
      "",
      "S40.136\t\t2DEC\t.4671 B-9\t\t# .4671 M NEWTONS (DPS)",
      "S40.136_\t2DEC\t.4671 B+1\t\t# S40.136 SHIFTED LEFT 10.",
      "",
      "\t\tSETLOC\tASENT1",
      "\t\tBANK",
      "\t\tCOUNT*\t$$/P70",
      "",
      "(1/DV)A\t\t2DEC\t15.20 B-7\t\t# 2 SECONDS WORTH OF INITIAL ASCENT",
      "# Page 39",
      "\t\t\t\t\t\t# STAGE ACCELERATION -- INVERTED (M/CS)",
      "\t\t\t\t\t\t# 1) PREDICATED ON A LIFTOFF MASS OF",
      "\t\t\t\t\t\t#    4869.9 KG (SNA-8-D-027 7/11/68)",
      "\t\t\t\t\t\t# 2) PREDICATED ON A CONTRIBUTION TO VEH-",
      "\t\t\t\t\t\t#    ICLE ACCELERATION FROM RCS THRUSTERS",
      "\t\t\t\t\t\t#    EQUIV. TO 1 JET ON CONTINUOUSLY.",
      "",
      "K(1/DV)\t\t2DEC\t436.70 B-9\t\t# DPS ENGINE THRUST IN NEWTONS / 100 CS.",
      "",
      "(AT)A\t\t2DEC\t3.2883 E-4 B9\t\t# INITIAL ASC. STG. ACCELERATION ** M/CS.",
      "\t\t\t\t\t\t# ASSUMPTIONS SAME AS FOR (1/DV)A.",
      "(TBUP)A\t\t2DEC\t91902 B-17\t\t# ESTIMATED BURN-UP TIME OF THE ASCENT STG.",
      "\t\t\t\t\t\t# ASSUMPTIONS SAME AS FOR (1/DV)A WITH THE",
      "\t\t\t\t\t\t# ADDITIONAL ASSUMPTION THAT NET MASS-FLOW",
      "\t\t\t\t\t\t# RATE = 5.299 KG/SEC = 5.135 (APS) +",
      "\t\t\t\t\t\t# .164 (1 RCS JET).",
      "\t\tSETLOC\tASENT",
      "\t\tBANK",
      "\t\tCOUNT*\t$$/ASENT",
      "AT/RCS\t\t2DEC\t.0000785 B+10\t\t# 4 JETS IN A DRY LEM",
      "",
      "\t\tSETLOC\tSERVICES",
    ],
  };
  // TODO: consider merging with buffers as metadata
  let attachedBuffers = {};
  let lastId = Math.max.apply(Math, Object.keys(buffers).map(k => parseInt(k)).sort()) || 0;
  render();

  function signalAttached(id, count) {
    attachedBuffers[id] = (attachedBuffers[id] + count || count);
  }

  function render() {
    // TODO: do an incremental rendering
    el.innerHTML = Object.keys(buffers).map(
      bufferId => `<li> ${parseInt(attachedBuffers[bufferId]) > 0 ? '👁️' : ''} ${bufferId}</li>`).join('');
  }

  this.addRandomBuffer = function () {
    buffers[++lastId] = Array.from(Array(Math.floor(Math.random() * 50) + 10),
      (_, i) => `This is line #${i + 1}`)
    signalAttached(lastId, 1);
    render();
    return lastId;
  }
  this.signalAttached = signalAttached;
  this.get = id => buffers[id];

  return this;
};