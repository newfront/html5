/* main.js */
var Engine = {
    Area: {
        current: "testArea",
        top: null,
        left: null,
        bottom: null,
        right: null
    },
    TileMaps: {},
    Level: {},
    Viewport: {}
}, game, hero, treeHit, treeHit2, background;

require(['helpers/gamepad','config/areas/test_area','engine/tiled_map','engine/display_list','engine/game','engine/sprite','engine/entity', 'engine/character', 'characters/hero'], function () {
    
    game = new Game({
        width: 320,
        height: 320,
        controllers: [{
            type: "gamepad",
            context: new Utils.GamePad(),
            method: "init"
        }]
    });
    game.init(); // create canvas, get contexts

    // need to be able to plugin gamepad api if available
    // need to make game listen to controllers as well
    game.addListener(document, "keydown");
    game.addListener(document, "keyup");

    // if we have a gamepad attached
    if (game.remotes.gamepad && game.remotes.gamepad.supported) {
        // bind the game's handleRemote method to the gamepad observer
        game.remotes.gamepad.registerObserver({
            id: "engine",
            type: "buttonPressed",
            method: game.handleRemote.bind(game)
        });
    }

    // test loading in a comprehensive tile map as background context

    background = new TiledMap(Engine.TileMaps[Engine.Area.current], game.ui.background_context);
    background.preload();

    
    treeHit = new Sprite({
        x: 21,
        y: 51,
        width: 16,
        height: 16,
        collidable: true,
        showBounds: false,
        boundsColor: "red",
        image: 'images/sprites/misc/clear.gif',
        hitRect: {
            enabled: true,
            height: 40,
            width: 40,
            xOffset: 0,
            yOffset: 0
        },
        sx: 32
    });

    treeHit2 = new Sprite({
        type: "enemy",
        x: 163,
        y: 44,
        width: 16,
        height: 16,
        collidable: true,
        showBounds: false,
        boundsColor: "green",
        image: 'images/sprites/misc/clear.gif',
        hitRect: {
            enabled: true,
            height: 30,
            width: 100,
            xOffset: 0,
            yOffset: 0
        },
        sx: 32
    });

    game.displayList.add(treeHit);
    game.displayList.add(treeHit2);

    game.renderBackground();

    hero = new Hero({
        type: "hero",
        image: 'images/sprites/link/walking_all.png',
        height: 50,
        width: 34,
        x: 0,
        y: 0,
        /*showBounds: true,
        boundsColor: "green",*/
        collidable: true,
        collidesWith: game.displayList,
        hitRect: {
            enabled: true,
            xOffset: 3,
            yOffset: 7,
            width: -7,
            height: -10
        },
        scaleY: 1,
        scaleX: 1
    });

    hero_test = new Hero({
        image: 'images/sprites/link/link_run_all_sm.png',
        height: 90,
        width: 34,
        x: 60,
        y: 60,
        showBounds: false,
        boundsColor: "red",
        collidable: true,
        collidesWith: game.displayList,
        hitRect: {
            enabled: true,
            xOffset: 3,
            yOffset: 7,
            width: -7,
            height: -10
        },
        scaleY: 1,
        scaleX: 1
    });

    game.addObserver(hero, "keydown", "handleKeypress");
    game.addObserver(hero, "keyup", "handleKeyUp");
    game.addObserver(hero, "buttonsPressed", "handleRemoteController");
    
    // displayList is the foreground
    game.displayList.add(hero);

    // note: if you want link to be able to run behind an object, it can't be in the background layer
    // in general it is better for performance if you paint the background seldomly, and only update the main canvas
    // you have 3 canvas's to composite if you want (game.ui.canvas, game.ui.buffer, game.ui.background)
    // buffer will probably be renamed to something else since compositing is working nicely without the need for a real double buffer

    game.render();

});