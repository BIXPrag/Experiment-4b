// This is a simple demo script, feel free to edit or delete it
// Find a tutorial and the list of availalbe elements at:
// https://www.pcibex.net/documentation/

PennController.ResetPrefix(null); // Shorten command names (keep this line here)
var showProgressBar = true; 
var progressBarText = "Fortschritt";

PennController.DebugOff()
//Debugger ist ein Hilfswerkzeug, das beim Test moegliche Fehlerquellen
//im Skript identifiziert und Verbesserungsvorschlaege macht. 
//Im fertigen Experiment sollte das natuerlich ausgeschaltet sein. 

Sequence( "Einleitung", "Angaben", "Instruktionen" , randomize("Exercise"), "Eigentlich", randomize("Experiment"), SendResults() , "Dank" );
//Legt die Reihenfolge fuer die einzelnen Sektionen des Experiments fest. 
//'randomize("Experiment")' randomisiert die Versuchsfolien fuer jeden Durchgang neu 

Header(
)
;
newTrial( "Einleitung" , //legt eine neue Experimentfolie mit dem Titel "Einleitung" an 
    newImage("logo", "logo.png")
    .size(260,150)
    .center()
    .print()
    ,
    newHtml("stage1", "stage1.html").print().log()//Zeigt die Datei "stage1.html" aus dem Ordner "Resources" als HTML an und zeichnet das auf. 
    ,
    newFunction( "Htmlclick", ()=>new Promise(r=>$("input[type=submit]").bind('click', e=>{
    e.preventDefault();
    e.stopPropagation();
    r();
    return false; 
    })) ) 
    .call()
    //Die Funktion "Htmlclick" sorgt dafuer, dass die aktuelle Folie so lange angezeigt wird, bis auf einen Knopf vom Typ "submit" 
    //in der aktuellen Html-Datei geklickt wird. Sobald das passiert, geht es mit dem Experiment weiter. 
    //ruft die Funktion Htmlclick auf. Sobald der Submit-Knopf "Ich will teilnehmen" gedrueckt wird, geht es weiter. 
    ,
    newFunction( ()=> {
      if (document.documentElement.requestFullscreen)
        document.documentElement.requestFullscreen();
      else if (document.documentElement.mozRequestFullScreen) /* Firefox */
        document.documentElement.mozRequestFullScreen();
      else if (document.documentElement.webkitRequestFullscreen) /* Chrome, Safari, Opera */
        document.documentElement.webkitRequestFullscreen();
      else if (document.documentElement.msRequestFullscreen) /* IE/Edge */
        document.documentElement.msRequestFullscreen();
    })
    .call()
    //Startet den Vollbild-Modus im Browser. Kompatiblitaet testen und Hinweis in stage1.html einfuegen! 
)
.setOption("countsForProgressBar", false)
.setOption("hideProgressBar", true);

newTrial( "Angaben" , 
    newText("Ueberschrift", "<h2>Stichproben-relevante Angaben</h2>").center().print()
    ,
    newTextInput("inputAlter")
    .size("100px")
    ,
    newScale("inputGeschlecht", "m&auml;nnlich", "weiblich", "divers")
    ,
    newScale("inputHaendigkeit", "linksh&auml;ndig", "rechtsh&auml;ndig")
    ,
    newTextInput("inputGeboren")
    ,
    newTextInput("inputWohnsitz")
    ,
    newScale("inputDeutsch", "ja", "nein")
    ,
    newTextInput("inputMuttersprache")
    ,
    newTextInput("inputProlific-ID")
    ,
    newCanvas("Canvas", 600, 320)
        .add( 0,    0,  newText("Alter:").cssContainer("padding", "10px 0px 0px"))
        .add( 400,  0,  getTextInput("inputAlter").log())
        .add( 0,    40,  newText("Geschlecht:"))
        .add( 400,  40,  getScale("inputGeschlecht").log())
        .add( 0,    80,  newText("H&auml;ndigkeit:"))
        .add( 400,  80,  getScale("inputHaendigkeit").log())
        .add( 0,    120,  newText("Geboren in (Bundesland/Staat):").cssContainer("padding", "10px 0px 0px"))
        .add( 400,  120,  getTextInput("inputGeboren").log())
        .add( 0,    160,  newText("Derzeitiger Wohnsitz (Bundesland/Staat):").cssContainer("padding", "10px 0px 0px"))
        .add( 400,  160,  getTextInput("inputWohnsitz").log())
        .add( 0,    200, newText("Deutsch als Muttersprache?"))
        .add( 400,  200, getScale("inputDeutsch").log())
        .add( 0,    240, newText("Muttersprachen (au&szlig;er Deutsch):").cssContainer("padding", "10px 0px 0px"))
        .add( 400,  240, getTextInput("inputMuttersprache").log())
        .add( 0,    280, newText("Prolific-ID:").cssContainer("padding", "10px 0px 0px"))
        .add( 400,  280, getTextInput("inputProlific-ID").log())
        .print()
    ,
    newText("Warnung1", "Bitte f&uuml;llen Sie die Pflichtangaben aus.")
        .color("red")
        .italic()
        .center()
        .hidden()
        .print()
    ,
    newButton("Weiter") 
        .center()
        .print()
        .wait(
            getTextInput("inputAlter").test.text(/.+/)
            .and(getTextInput("inputGeboren").test.text(/.+/))
            .and(getTextInput("inputWohnsitz").test.text(/.+/))
            .and(getTextInput("inputProlific-ID").test.text(/.+/))
            .and(getScale("inputGeschlecht").test.selected())
            .and(getScale("inputHaendigkeit").test.selected())
            .and(getScale("inputDeutsch").test.selected())
                .failure( 
                    getText("Warnung1")
                    .hidden()
                    ,
                    newTimer(100)
                    .start()
                    .wait()
                    ,
                    getText("Warnung1").visible() )
    )
    ,
    newVar("Alter")
        .global()
        .set( getTextInput("inputAlter") )
    ,
    newVar("Geboren")
        .global()
        .set( getTextInput("inputGeboren") )
    ,
    newVar("Wohnsitz")
        .global()
        .set( getTextInput("inputWohnsitz") )
    ,
    newVar("Muttersprache")
        .global()
        .set( getTextInput("inputMuttersprache") )
    ,
    newVar("Prolific-ID")
        .global()
        .set( getTextInput("inputProlific-ID") )
        ,
    newVar("Geschlecht")
        .global()
        .set( getScale("inputGeschlecht") )
    ,
    newVar("Haendigkeit")
        .global()
        .set( getScale("inputHaendigkeit") )
    ,
    newVar("Deutsch")
        .global()
        .set( getScale("inputDeutsch") )
    
)
    .log("Alter", getVar("Alter"))
    .log("Geschlecht", getVar("Geschlecht"))
    .log("Haendigkeit", getVar("Haendigkeit"))
    .log("Geboren", getVar("Geboren"))
    .log("Wohnsitz", getVar("Wohnsitz"))
    .log("Deutsch", getVar("Deutsch"))
    .log("Muttersprache", getVar("Muttersprache"))
    .log("Prolific-ID", getVar("Prolific-ID"))
.setOption("countsForProgressBar", false)
.setOption("hideProgressBar", true);

newTrial( "Instruktionen" ,
    newHtml("stage3", "stage3.html").print().log()
    ,
    newFunction( "Htmlclick", ()=>new Promise(r=>$("input[type=submit]").bind('click', e=>{
    e.preventDefault();
    e.stopPropagation();
    r();
    return false; 
    })) )
    .call()
)
.setOption("countsForProgressBar", false)
.setOption("hideProgressBar", true);

Template( "exercise.csv" , //Legt eine Vorlage fuer Uebungsfolien an
    row => newTrial( "Exercise" , //Zeigt nacheinander fuer jede Zeile von exercise.csv eine Folie an 
        newKey("Enter", "Enter")
            .callback(
                getButton("Weiter").click()
                )
        ,
        newText("<h2>&Uuml;bung</h2>").center().print() //Zeigt Text im Format Heading 2 an. Umlaut per Html kodiert
        ,
        newText("<b>Bitte setzen Sie den Satz fort:</b><br>").center().print()
        ,
        newText("")
        .settings.css({
        "padding-top": "50px"
        })
        .print()
        ,
        newText("Exvorher", row.Exvorher)
        ,
        newText("Exnachher", row.Exnachher)
        ,
        newText("Exbox", row.Exbox)
        .settings.css({"border": "solid 4px black", 
        "padding": "3px", "margin": "0px"})
        .settings.cssContainer({
        "background-color": "lightgrey",
        "width": "800px",
        "border-radius": "5px",
        "margin": "auto",
        "align": "center",
        "text-align": "center",
        "padding": "5px",
        "font-size": "large"})
        .before( getText("Exvorher") )
        .after ( getText("Exnachher") )
        .print()
        .log()
        ,
        newText("Line", "<hr>")
        .settings.css({
        "width": "100%",
        "margin": "auto",  
        })
        .print()
        ,
        newTextInput("Excontinuation", "")
        .lines(1)
        .center()
        .settings.css({
            "border": "solid 2px royalblue",
            "border-radius": "5px",
            "width": "75%",
            "align": "center",
            "text-align": "left",
            //"padding": "10px 5px 0px 5px",
            "font-size": "large",
            "margin": "auto"
        })
        .print()
        .log()
        ,
        newText("Line", "<hr>")
        .settings.css({
        "width": "100%",
        "margin": "auto",  
        })
        .print()
        ,
        newText("Warnung2", "Bitte geben Sie eine Fortsetzung ein.")
        .color("red")
        .italic()
        .center()
        .hidden()
        .print()
        ,
        newButton("Weiter")
        .center()
        .print()
        .wait( getTextInput("Excontinuation").testNot.text("")
            .failure( 
                getText("Warnung2")
                .hidden()
                ,
                newTimer(100)
                .start()
                .wait()
                ,
                getText("Warnung2").visible() ) 
        )
    )
    .setOption("countsForProgressBar", false)
    .setOption("hideProgressBar", true)
    .log("Excontinuation")
)
;

newTrial( "Eigentlich" ,
    newHtml("stage5", "stage5.html").print().log()
    ,
    newFunction( "Htmlclick", ()=>new Promise(r=>$("input[type=submit]").bind('click', e=>{
    e.preventDefault();
    e.stopPropagation();
    r();
    return false; 
    })) )
    .call()
)
.setOption("countsForProgressBar", false)
.setOption("hideProgressBar", true);


Template( GetTable( "exp4b_liste1-4.csv" ) 
        .setGroupColumn( "List" )
    ,
    row => newTrial( "Experiment", 
        newKey("Enter", "Enter")
            .callback(
                getButton("Weiter").click()
                )
        ,
        newText("")
        .settings.css({
        "padding-top": "100px"
        })
        .print()
        ,
        newText("Vorher", row.Vorher)
        ,
        newText("Nachher", row.Nachher)
        ,
        newText("Box", row.Box)
        .settings.css({"border": "solid 4px black", 
        "padding": "3px", "margin": "0px"})
        .settings.cssContainer({
        "background-color": "lightgrey",
        "width": "800px",
        "border-radius": "5px",
        "margin": "auto",
        "align": "center",
        "text-align": "center",
        "padding": "5px",
        "font-size": "large"})
        .before( getText("Vorher") )
        .after ( getText("Nachher") )
        .print()
        .log()
        ,
        newText("Line", "<hr>")
        .settings.css({
        "width": "100%",
        "margin": "auto",  
        })
        .print()
        ,
        newTextInput("Continuation", "")
        .lines(1)
        .center()
        .settings.css({
            "border": "solid 2px royalblue",
            "border-radius": "5px",
            "width": "75%",
            "align": "center",
            "text-align": "left",
            //"padding": "10px 5px 0px 5px",
            "font-size": "large",
            "margin": "auto"
        })
        .print()
        .log()
        ,
        newText("Line", "<hr>")
        .settings.css({
        "width": "100%",
        "margin": "auto",  
        })
        .print()
        ,
        newText("Warnung3", "Bitte geben Sie eine Fortsetzung ein.")
        .color("red")
        .italic()
        .center()
        .hidden()
        .print()
        ,
        newButton("Weiter")
        .center()
        .print()
        .wait( getTextInput("Continuation").testNot.text("")
            .failure( 
                getText("Warnung3")
                .hidden()
                ,
                newTimer(100)
                .start()
                .wait()
                ,
                getText("Warnung3").visible() ) 
        )
    )
    .log("Alter", getVar("Alter"))
    .log("Geschlecht", getVar("Geschlecht"))
    .log("Haendigkeit", getVar("Haendigkeit"))
    .log("Geboren", getVar("Geboren"))
    .log("Wohnsitz", getVar("Wohnsitz"))
    .log("Deutsch", getVar("Deutsch"))
    .log("Muttersprache", getVar("Muttersprache"))
    .log("Prolific-ID", getVar("Prolific-ID"))
    //Zeichnet demografische Angaben aus Folie 2 in jeder Ergebniszeile auf
    .log("Item", row.Item)
    .log("Condition", row.Condition)
    .log("NP1", row.NP1)
    .log("NP2", row.NP2)
    .log("Coref", row.Coref)
    .log("Verbclass", row.Verbclass)
    .log("List", row.List)
    .log("Experiment", row.Experiment)
    .log("Prompt", row.Prompt)
    //Zeichnet Werte aus den angegebenen Tabellenspalten fuer die aktuelle Tabellenzeile auf 
)
;
Template( GetTable( "exp4b_links.csv" ) 
        .setGroupColumn( "List" )
        ,
    row => newTrial( "Dank" ,
        newFunction( ()=> {
            if (document.exitFullscreen)
                document.exitFullscreen();
            else if (document.mozCancelFullScreen) /* Firefox */
                document.mozCancelFullScreen();
            else if (document.webkitExitFullscreen) /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            else if (document.msExitFullscreen) /* IE/Edge */
                document.msExitFullscreen();
        }).call() //Verlaesst Vollbild-Modus des Browsers
        ,
        newHtml("stage7", "stage7.html").print()
        ,
        newText("Link", row.Link).center().print()
        ,
        newButton("void")
            .wait()
    //Trick: Eine Schaltflaeche wird erstellt, aber nie angezeigt (via print()-Befehl)
    //sodass unendlich lange auf den Knopfdruck gewartet wird. Das stellt sicher, dass 
    //VPn auf diesem Trial-Bildschirm bleiben. 
    )
    .setOption("countsForProgressBar", false)
);
