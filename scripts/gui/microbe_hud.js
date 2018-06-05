// JavaScript code to handle updating all the microbe stage stuff
"use strict";

let microbeHudSetupRan = false;

let readyToEdit = false;

//! Registers all the stuff for this to work. For performance reasons
//! this should only be called
function runMicrobeHUDSetup(){

    if(microbeHudSetupRan)
        return;

    document.getElementById("microbeToEditorButton").addEventListener(
        "click", onEditorButtonClicked, true);

    if(isInEngine()){

        // Register for the microbe stage events
        Leviathan.OnGeneric("PlayerCompoundAmounts", (event, vars) => {

            // Apply the new values
            updateMicrobeHUDBars(vars);
        });

        // Event for receiving data about stuff we are hovering over
        Leviathan.OnGeneric("PlayerMouseHover", (event, vars) => {

            // Apply the new values
            updateHoverInfo(vars);
        });

        // Event for entering the editor
        Leviathan.OnGeneric("MicrobeEditorEntered", doEnterMicrobeEditor);

        // Event that enables the editor button
        Leviathan.OnGeneric("PlayerReadyToEnterEditor", onReadyToEnterEditor);
        
    } else {

        // Update random values to make it prettier to look at
        let hp = randomBetween(10, 50);
        let ammonia = randomBetween(0, 50);
        let glucose = randomBetween(10, 50);
        let oxytoxy = randomBetween(0, 10);
        let phosphate = randomBetween(0, 50);
        let hydrogenSulfide = randomBetween(0, 50);
        updateMicrobeHUDBars({
            hitpoints: randomBetween(1, hp),
            maxHitpoints: hp,
            compoundATP: randomBetween(10, 100),
            ATPMax: 100,
            compoundAmmonia: randomBetween(0, ammonia),
            AmmoniaMax: ammonia,
            compoundGlucose: randomBetween(0, glucose),
            GlucoseMax: glucose,
            compoundOxytoxy: randomBetween(0, oxytoxy),
            OxytoxyMax: oxytoxy,
            compoundPhosphate: randomBetween(0, phosphate),
            PhosphateMax: phosphate,
            compoundHydrogenSulfide: randomBetween(0, hydrogenSulfide),
            HydrogenSulfideMax: hydrogenSulfide,
        });

        // Put some hover stuff
        updateHoverInfo({
            mousePos: "[0, 0, 0]",
            ammonia0: "Ammonia: 12.2",
        });

        onReadyToEnterEditor();
    }
    
    microbeHudSetupRan = true;
}

//! Enables the editor button
function onReadyToEnterEditor(){
    
    readyToEdit = true;
    document.getElementById("microbeToEditorButton").classList.remove("DisabledButton");
}

function onEditorButtonClicked(event){
    
    if(!readyToEdit)
        return false;
    
    event.stopPropagation();
    playButtonPressSound();
    
    // Fire event
    if(isInEngine()){

        // Fire an event to tell the game to swap to the editor. It
        // will notify us when it is done
        Thrive.editorButtonClicked();
        
    } else {

        // Swap GUI for previewing
        doEnterMicrobeEditor();
    }
    
    // Disable
    document.getElementById("microbeToEditorButton").classList.add("DisabledButton");
    readyToEdit = false;
}

//! Updates the mouse hover box with stuff
function updateHoverInfo(vars){

    let panel = document.getElementById("mouseHoverPanel");
    clearChildren(panel);

    panel.appendChild(document.createTextNode("Stuff at " + vars.mousePos + ":"));
    
    if(vars.noCompounds){

        panel.appendChild(document.createElement("br"));
        panel.appendChild(document.createTextNode("Nothing to eat here"));
        
    } else {

        getKeys(vars).forEach(function(key){

            // Skip things that are handled elsewhere
            if(key == "mousePos")
                return;

            // Line breaks between elements
            panel.appendChild(document.createElement("br"));

            // Debug print version
            // panel.appendChild(document.createTextNode(key + ": " + vars[key]));
            panel.appendChild(document.createTextNode(vars[key]));
        });
    }

    // Last line break needs to be skipped to avoid an excess empty line
}

//! Updates the GUI bars
//! values needs to be an object with properties set with values for everything
function updateMicrobeHUDBars(values){
    document.getElementById("microbeHUDPlayerHitpoints").textContent =
        values.hitpoints;
    document.getElementById("microbeHUDPlayerMaxHitpoints").textContent =
        values.maxHitpoints;
    document.getElementById("microbeHUDPlayerHitpointsBar").style.width =
        barHelper(values.hitpoints, values.maxHitpoints);

    // TODO: remove this debug code
    document.getElementById("microbeHUDPlayerATP").textContent =
        values.compoundATP.toFixed(1);

    // The bars
    // document.getElementById("microbeHUDPlayerATPCompound").textContent =
    //     values.compoundATP;
    document.getElementById("microbeHUDPlayerATPMax").textContent =
        values.ATPMax;
    document.getElementById("microbeHUDPlayerATPBar").style.width =
        barHelper(values.compoundATP, values.ATPMax);

    document.getElementById("microbeHUDPlayerAmmonia").textContent =
        values.compoundAmmonia.toFixed(1);
    document.getElementById("microbeHUDPlayerAmmoniaMax").textContent =
        values.AmmoniaMax;
    document.getElementById("microbeHUDPlayerAmmoniaBar").style.width =
        barHelper(values.compoundAmmonia, values.AmmoniaMax);

    document.getElementById("microbeHUDPlayerPhosphates").textContent =
        values.compoundPhosphate.toFixed(1);
    document.getElementById("microbeHUDPlayerPhosphatesMax").textContent =
        values.PhosphateMax;
    document.getElementById("microbeHUDPlayerPhosphatesBar").style.width =
        barHelper(values.compoundPhosphate, values.PhosphateMax);
        
    document.getElementById("microbeHUDPlayerGlucose").textContent =
        values.compoundGlucose.toFixed(1);
    document.getElementById("microbeHUDPlayerGlucoseMax").textContent =
        values.GlucoseMax;
    document.getElementById("microbeHUDPlayerGlucoseBar").style.width =
        barHelper(values.compoundGlucose, values.GlucoseMax);

    document.getElementById("microbeHUDPlayerOxytoxy").textContent =
        values.compoundOxytoxy.toFixed(1);
    document.getElementById("microbeHUDPlayerOxytoxyMax").textContent =
        values.OxytoxyMax;
    document.getElementById("microbeHUDPlayerOxytoxyBar").style.width =
        barHelper(values.compoundOxytoxy, values.OxytoxyMax);
        
    document.getElementById("microbeHUDPlayerHydrogenSulfide").textContent =
        values.compoundHydrogenSulfide.toFixed(1);
    document.getElementById("microbeHUDPlayerHydrogenSulfideMax").textContent =
        values.HydrogenSulfideMax;
    document.getElementById("microbeHUDPlayerHydrogenSulfideBar").style.width =
        barHelper(values.compoundHydrogenSulfide, values.HydrogenSulfideMax);
        
}
