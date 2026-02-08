/**

                      
                    
                    
               - P A T H   O F   L I G H T -
                
                        A 3D Game



Verified winners:
Digits - 303
Daemon - 492
DemoKhan - 601
SRTCoder15 - 697
The Coon 🦝 - 1476
*/

// save code.
var saveCode = [0, 0, 0, 0];

// Enable/disable stroke outlines for everything. This is all preference.
var showOutlines = true;

// camera sensitivity
var mouseSensitivity = 0.2;

// Creates the 3d graphics
var g = createGraphics(width, height, P3D);
// tell ohnoes external exists (so he doesn't crash out)
var externals;
// draw shading 
g.lights();


// Modified doors inspired death animation from a projcet i already made [
var drawSkull = function(x, y, s){
    noStroke();
    beginShape();
    vertex(x+s/2.5, y-s/1.65);
    vertex(x+s/2.3, y-s/1.8);
    vertex(x+s/3.5, y-s/3.1);
    vertex(x+s/35, y-s/4.3);
    vertex(x+s/6, y);
    vertex(x+s/6.7, y-s/5.5);
    vertex(x+s/2.75, y-s/5.5);
    vertex(x+s/1.96, y-s/2.5);
    vertex(x+s/1.8, y-s/2.5);
    vertex(x+s/1.57, y-s/3.5);
    vertex(x+s/1.57, y+s/4.4);
    vertex(x+s/2.35, y+s/2.75);
    vertex(x+s/2.7, y+s/1.69);
    vertex(x+s/4.4, y+s/1.65);
    vertex(x+s/4.3, y+s/2.1);
    vertex(x+s/5.7, y+s/2.1);
    vertex(x+s/6.5, y+s/1.65);
    vertex(x+s/19, y+s/1.65);
    vertex(x+s/20, y+s/2.15);
    vertex(x-s/60, y+s/2.15);
    vertex(x-s/60, y+s/1.65);
    vertex(x-s/10, y+s/1.65);
    vertex(x-s/7.4, y+s/2.15);
    vertex(x-s/5.3, y+s/2.15);
    vertex(x-s/5.8, y+s/1.65);
    vertex(x-s/3, y+s/1.64);
    vertex(x-s/2.5, y+s/2.54);
    vertex(x-s/1.64, y+s/4);
    vertex(x-s/1.58, y-s/3.1);
    vertex(x-s/2.26, y-s/1.73);
    vertex(x+s/2.5, y-s/1.65);
    endShape();
    };
var drawEye = function(x, y, s){
    beginShape();
    noStroke();
    vertex(x-s/9, y-s/7);
    vertex(x-s/5.1, y-s/70);
    vertex(x-s/12, y+s/13);
    vertex(x-s/5.4, y+s/7);
    vertex(x-s/3.45, y+s/13);
    vertex(x-s/2.75, y+s/7.6);
    vertex(x-s/2.2, y+s/22);
    vertex(x-s/2.5, y-s/40);
    vertex(x-s/2.2, y-s/10);
    vertex(x-s/2.7, y-s/5.6);
    vertex(x-s/3.35, y-s/8);
    vertex(x-s/5.1, y-s/5);
    vertex(x-s/9, y-s/7);
    endShape();
    };
// how big ths skull is
var skullSize = 20000;
// the transparancy of the skull
var skullTrans = 0;
// holds frames of animation
var deathAnimationFrames = 0;
// how much the skull
var shakeIntensity = 25;
// The transparancy of the texts that appear
var gameOverTextTransparency = 1;
// shake x & y
var shakeX = 0, shakeY = 0;
// the size of the circle in the middle that expands
var innerCircleSize = 1;
// ]
// are you dead?
var dead = false;


// Heavily modified smile from "Happy :)" by me
var drawFace = function(x, y, s){
    g.pushMatrix();
    // it was slightly off center
    g.translate(s-s*1.1,s-s/1.1);
    // no outline
    g.noStroke();
    // black
    g.fill(0, 0, 0);
    // eyes
    g.ellipse(x-s*1.335, y-s/5.5, s/1.9, s/1.9);
    g.ellipse(x+s*1.43, y-s/5.5, s/1.9, s/1.9);
    // smile setup
    g.strokeWeight(s/PI);
    g.stroke(0);
    g.noFill();
    
    // Smile
    g.arc(x+s/10, y-s/10, s/1.3, s/1.3, 0, PI);
    g.popMatrix();
};


// CUBE VARS
// player position
var playerX = 0, playerY = 0, playerZ = 0;
// Player size (make him comicly large guys)
var playerSize = 30;
// player rotation on all axes
var playerRotationY = 0, playerVelocityX = 0, playerVelocityZ = 0;
// How fast the player accelerates
var acceleration = 0.25;
// How fast the player deaccelerates
var friction = 0.9;
// The speed cap (minus acceleration to make it exact)
var maxSpeed = 3 - acceleration;

// CAMERA VARS
// player -> Camera distance
var camDist = 150;
// camera angle
var camAngleY = 0, camAngleX = -15;
// Offset for camera Y
var camYOffset = -20;
// Camera min/max (near but not > 90)
var camAngleXMin = -80, camAngleXMax = 80;

// JUMPING VARS
// are we jumping, how fast we jumping, how strong is gravity, are we on the ground
var isJumping = false, jumpSpeed = 0, gravity = 0.4, onGround = true;

// POSITION TRACKING
// previous position for player. (Will be important later)
var prevPlayerX = 0, prevPlayerY = -100, prevPlayerZ = 0;
// initail position for player.
var initialPlayerX = 0, initialPlayerY = -100, initialPlayerZ = 0;
// how far the player must fall to reset him (void)
var fallResetY = 1000;

// LEVEL VARS
// array to store levels
var levels = [];
// current level
var currentLevel = saveCode[1] / 3;
// array to store solid blocks
var colliders = [];
// level goal (if finished or not)
var goal = null; 

// adds commas to numbers. Mine but i made it before this started. It's 3 lines anyway
var formatNumber = function(num) {
      return num.toLocaleString();
};

var txtFade = 0;

// the names of the levels
var levelNames = [
    "The City of Darkness",
    "The Exit",
    "There is Hope",
    "The Cliff",
    "The Tower",
    "Three Thousand Feet and Climbing",
    "The First Life",
    "A Thing Called Color", 
    "The Final Gate",
];

// look at Kineto such an amazing poet <3
var levelPoems = [
    "A shadow stirs, the path is near,\nThe tale begins, yet fate’s unclear.", // Level 1
    "Through broken gates, the lost may flee,\nA hidden door shall set you free.", // Level 2
    "From ruin’s depth, the steps arise,\nA fragile light betrays the skies.", // Level 3
    "Shifting forms in twilight’s sway,\nGuard the secrets night won’t say.", // Level 4
    "The climb begins, the air grows thin,\nEach stone recalls what lies within.", // Level 5
    "The void below, the heavens call,\nOne slip foretells the final fall.", // Level 6
    "Roots of green defy the gray,\nThe earth remembers, come what may.", // Level 7
    "Dull horizons wake with fire,\nShades reborn from long desire.", // Level 8
    "Atop the hill, the light awaits,\nThe journey ends—yet opens gates." // Level 9
];


// this makes the typing affect. Hevaliy modified from my "happy pi day" program from a long time ago.
var currentDigitPosition = 0;

// SETUP VARS
// actually build the levels
function buildLevels() {

    // Level 1: The City of Destruction
levels.push({
    colliders: (function() {
        var colliders = [];
        
        // Main ground floor
        colliders.push({
            position: { x: 0, y: 50, z: 0 },
            size: { width: 1200, height: 10, length: 1200 },
            color: g.color(40)
        });

        // Spawn point
        var spawnX = 0;
        var spawnZ = 0;
        var safeRadius = 120; // how much open space around spawn

        // Scatter city buildings randomly
        var numBuildings = 30;
        for (var b = 0; b < numBuildings; b++) {
            var x = Math.floor(Math.random() * 1000 - 500);
            var z = Math.floor(Math.random() * 1000 - 500);
        
            // Leave the alley area clear
            if (x > -500 && x < -200 && z < -100 && z > -500) {
                continue;
            }
            // size of building
            var width = 50 + Math.random() * 80;
            var length = 50 + Math.random() * 80;
            var height = 350;
        
            // --- prevent buildings from spawning near the spawn point ---
            var dx = x - spawnX;
            var dz = z - spawnZ;
            if (Math.abs(dx) < (width / 2 + safeRadius) &&
                Math.abs(dz) < (length / 2 + safeRadius)) {
                continue; // skip this building
            }
        // build the buildings
            colliders.push({
                position: { x: x, y: -100, z: z },
                size: { width: width, height: height, length: length },
                // Gray coloor
                color: g.color(60 + Math.random() * 40)
            });
        }
        
        // --- Extra debris scattered across the city ---
        var numDebris = 20; // not too much, just enough detail
        for (var d = 0; d < numDebris; d++) {
            var dx = Math.floor(Math.random() * 1000 - 500);
            var dz = Math.floor(Math.random() * 1000 - 500);
        
            // Don’t put debris in spawn or in alley clear zone
            if (Math.abs(dx) < 150 && Math.abs(dz) < 150) {continue;}
            if (dx > -500 && dx < -200 && dz < -100 && dz > -500) {continue;}
        
            var w = 10 + Math.random() * 40;
            var h = 10 + Math.random() * 40;
            var l = 10 + Math.random() * 40;
        // make the junk
            colliders.push({
                position: { x: dx, y: 30, z: dz },
                size: { width: w, height: h, length: l },
                color: g.color(
                    20 + Math.random() * 20,
                    20 + Math.random() * 20,
                    20 + Math.random() * 20
                ) // random junk colors
            });
        }


        // Alley walls 
        colliders.push({
            position: { x: -220, y: -100, z: -300 },
            size: { width: 80, height: 300, length: 500 },
            color: g.color(70)
        });
        colliders.push({
            position: { x: -480, y: -100, z: -300 },
            size: { width: 80, height: 300, length: 500 },
            color: g.color(70)
        });

        // Alley clutter
        colliders.push({
            position: { x: -350, y: 30, z: -200 },
            size: { width: 40, height: 30, length: 20 },
            color: g.color(30, 40, 50)
        });
        colliders.push({
            position: { x: -370, y: 30, z: -260 },
            size: { width: 25, height: 25, length: 25 },
            color: g.color(50, 35, 25)
        });
        colliders.push({
            position: { x: -330, y: 30, z: -350 },
            size: { width: 30, height: 30, length: 30 },
            color: g.color(45, 45, 45)
        });

        return colliders;
    })(),

    // The portal at the far end of the alley (centered between walls)
    goal: {
        position: { x: -350, y: 20, z: -480 }, 
        size: { width: 40, height: 40, length: 40 }, 
        color: g.color(0, 255, 100)
    },
    // Bleh background
    background: 0
    
});

    // Level 2: The Exit
levels.push({
    colliders: (function() {
        var colliders = [];

        // Floor
        colliders.push({
            position: { x: 0, y: 100, z: -500 },
            size: { width: 200, height: 10, length: 1400 },
            color: g.color(50)
        });

        // Side walls
        colliders.push({
            position: { x: -120, y: 100, z: 0 },
            size: { width: 80, height: 500, length: 1400 },
            color: g.color(70)
        });
        colliders.push({
            position: { x: 120, y: 100, z: 0 },
            size: { width: 80, height: 500, length: 1200 },
            color: g.color(70)
        });
        colliders.push({
            position: { x: 0, y: 100, z: 400 },
            size: { width: 200, height: 500, length: 500 },
            color: g.color(70)
        });

        // Useless blobs
        var zPos = -200;
        for (var i = 0; i < 4; i++) {
            // Alternate them left/right
            // ? is underrated
            var side = (i % 2 === 0) ? -40 : 40;
            colliders.push({
                position: { x: side, y: 40, z: zPos },
                size: { width: 60, height: 80, length: 40 },
                color: g.color(80)
            });
            zPos -= 200;
        }

        // Extra useless blobs that add to the dystopian feel
        colliders.push({
            position: { x: 0, y: 60, z: -150 },
            size: { width: 30, height: 30, length: 30 },
            color: g.color(20, 20, 20)
        });
        colliders.push({
            position: { x: -30, y: 60, z: -350 },
            size: { width: 25, height: 25, length: 25 },
            color: g.color(15, 15, 15)
        });
        colliders.push({
            position: { x: 40, y: 60, z: -600 },
            size: { width: 35, height: 35, length: 35 },
            color: g.color(25, 25, 25)
        });

        return colliders;
    })(),

    // Goal at farrrr end of the corridor
    goal: { 
        position: { x: 0, y: 40, z: -1000 }, 
        size: { width: 40, height: 40, length: 40 }, 
        color: g.color(0, 255, 0) 
    },
    // slightly ligher O:
    background: 20
    
});

// Level 3: There is Hope – floating platforms leading to a ledge
levels.push({
    colliders: (function() {
        var colliders = [];

        // Main floor
        colliders.push({
            position: { x: 0, y: 0, z: 0 },
            size: { width: 1200, height: 10, length: 1200 },
            color: g.color(60) // dull concrete base
        });

        // Floating platforms leading up to the ledge
        var platformCount = 4;
        var baseX = -200, baseZ = -200;
        for (var i = 0; i < platformCount; i++) {
            var x = baseX + i * 120 + (Math.random() * 30 - 15); 
            var z = baseZ + i * 100 + (Math.random() * 30 - 15);
            var y = -20 - i * 60; // gradually higher per platform

            colliders.push({
                position: { x: x, y: y, z: z },
                size: { width: 70, height: 10, length: 70 },
                color: g.color(70 + Math.random() * 20)
            });
        }

        // Final ledge at the top
        colliders.push({
            position: { x: baseX + platformCount * 160, y: -350 + platformCount * 60, z: baseZ + platformCount * 100 },
            size: { width: 300, height: 300, length: 300 },
            color: g.color(90)
        });

        // Some decorative blobs
        var numRuins = 8;
        for (var r = 0; r < numRuins; r++) {
            var rx = Math.random() * 800 - 400;
            var rz = Math.random() * 800 - 400;
            var ry = 0;
            var rWidth = 60 + Math.random() * 80;
            var rLength = 60 + Math.random() * 80;
            var rHeight = 20 + Math.random() * 30;

            colliders.push({
                position: { x: rx, y: ry, z: rz },
                size: { width: rWidth, height: rHeight, length: rLength },
                color: g.color(70 + Math.random() * 30)
            });
        }

        return colliders;
    })(),

    // Goal on the ledge
    goal: {
        position: { x: 400, y: -350, z: 350 }, 
        size: { width: 40, height: 40, length: 40 },
        color: g.color(0, 255, 50)
    },

    background: 40
});



    //Level 4: The Cliff (more climbing yay)
levels.push({
    colliders: (function() {
        var colliders = [];

        // Starting platform
        colliders.push({
            position: { x: 0, y: 0, z: 0 },
            size: { width: 100, height: 10, length: 100 },
            color: g.color(80) 
        });
        // adjustablity is good 
        var platformCount = 12;
        var baseX = 0, baseZ = 0;
        var lastPlatform = { x: baseX, y: 0, z: baseZ };


        for (var i = 0; i < platformCount; i++) {
            var x = lastPlatform.x + 80 + (Math.random() * 40 - 20); // Horizontal offset
            var z = lastPlatform.z + 80 + (Math.random() * 40 - 20); // Forward offset
            var y = -20 - i * 30; // Graduallyyyyy

            // Randomly make some platforms super narrow
            var pWidth = 40 + Math.random() * 30;
            var pLength = 40 + Math.random() * 30;

            if (i % 3 === 0 && i > 0) {

                colliders.push({
                    position: { x: x, y: y, z: z },
                    size: { width: 10, height: 30, length: 10 },
                    color: g.color(50)

                });
            } else {
                colliders.push({
                    position: { x: x, y: y, z: z },
                    size: { width: pWidth, height: 10, length: pLength },
                    color: g.color(50 + Math.random() * 40)
                });
            }

            lastPlatform = { x: x, y: y, z: z };
        }

        // big platform
        colliders.push({
            position: { x: lastPlatform.x + 200, y: lastPlatform.y - 50, z: lastPlatform.z + 200 },
            size: { width: 250, height: 10, length: 250 },
            color: g.color(100)
        });

        return colliders;
    })(),

    goal: {
        position: { x: 1200, y: -450, z: 1200 }, 
        size: { width: 40, height: 40, length: 40 },
        color: g.color(0, 255, 50)
    },

    background: 60
});

    
    //Level 5: The Tower - climb a tower really high

    // Varibles that helped me make it actually playable
    var towerPlatformCount = 15;
    var towerYStart = 0;
    var towerYStep = -60;
    var towerRadius = 150;
    var towerAngleStep = Math.PI / 4.5;
    // Offset so he don't spawn inside of it
    var towerX = 60;
    var finalPlatformY = towerYStart + towerPlatformCount * towerYStep;
var landingPlatformY = finalPlatformY; 

    levels.push({
        colliders: (function() {
        var colliders = [];
            colliders.push({
                position: { x: towerX, y: 0, z: 0 },
                size: { width: 150, height: 10, length: 150 },
                color: g.color(90)
            });
            colliders.push({
                position: { x: towerX, y: landingPlatformY / 2, z: 0 }, 
                size: { width: 80, height: Math.abs(landingPlatformY), length: 80 },
                color: g.color(20, 20, 25) // Dark, imposing core
            });

            // Generate spiral platforms around the core using trig
            for (var i = 1; i <= towerPlatformCount; i++) {
                var angle = i * towerAngleStep;
                // sin/cos wahhhhh
                var x = towerX + towerRadius * Math.cos(angle);
                var z = towerX + towerRadius * Math.sin(angle);
                var y = towerX + towerYStart + i * towerYStep;

                var pWidth = 40 + (i % 4) * 5; 
                var pLength = 40 + (i % 4) * 5;

                colliders.push({
                    position: { x: x, y: y, z: z },
                    size: { width: pWidth, height: 10, length: pLength },
                    color: g.color(30 + (i % 3) * 10) 
                });
            }


            colliders.push({
                position: { x: towerX, y: landingPlatformY, z: 0 },
                size: { width: 150, height: 10, length: 150 },
                color: g.color(120, 100, 50) 
            });

            return colliders;
        })(),


        goal: {
            position: { x: towerX, y: landingPlatformY, z: 0 },
            size: { width: 40, height: 40, length: 40 },
            color: g.color(13, 255, 0) 
        },

        background: color(40, 62, 64) 
    });
    
    
        // Level 6: 3,000 Feet and Climbing - hard jumps that are above void
    levels.push((function() {
        // Level 6 variables
        var voidPlatformCount = 20;
        var voidYStart = 50; // Start slightly higher than 0
        var voidYStep = -25; // Small descent per jump for a long climb feel
        var lastPlatform = { x: 0, y: voidYStart, z: 0 };
        // This has to be in every level to remove the ones from other levels
        var colliders = [];
        colliders.push({
            position: { x: lastPlatform.x, y: lastPlatform.y, z: lastPlatform.z },
            size: { width: 80, height: 10, length: 80 },
            color: g.color(100)
        });
        for (var i = 0; i < voidPlatformCount; i++) {
            // Random horizontal distance but it is possible
            var distance = 128 + Math.random() * 50;
            // Random angle
            var angle = Math.random() * 1.5 * Math.PI;

            // Calculate horizontal offsets
            var dx = distance * Math.cos(angle);
            var dz = distance * Math.sin(angle);

            var x = lastPlatform.x + dx;
            var z = lastPlatform.z + dz;
            var y = lastPlatform.y + voidYStep; // Platforms descend

            // Platform size is 35x35 to 50x50
            var pSize = 35 + Math.random() * 20;

            colliders.push({
                position: { x: x, y: y, z: z },
                size: { width: pSize, height: 10, length: pSize },
                color: g.color(100 + Math.random() * 40)
            });

            lastPlatform = { x: x, y: y, z: z };
        }

        // Return the complete level object
        return {
            colliders: colliders,
            
            goal: {
                position: { x: lastPlatform.x, y: lastPlatform.y, z: lastPlatform.z },
                size: { width: 40, height: 40, length: 40 },
                color: g.color(0, 250, 9) 
            },
            // oooo more blue
            background: color(40, 81, 100)
        };

    })());

    // Level 7: The First Life - trees or whatever appear
    // they are just green platforms but i call them "bushes"

        levels.push((function() {
var colliders = [];
        var initialY = 100; 
        var platformStepY = -40; 
        // I originally had this as 150 but then tried playing it and realised that's prob to much
        var platformCount = 50; // big boy
        var lastPlatform = { x: 0, y: initialY, z: 0 };

        colliders.push({
            position: { x: lastPlatform.x, y: lastPlatform.y, z: lastPlatform.z },
            size: { width: 120, height: 10, length: 120 },
            color: g.color(50, 80, 50)
        });


        for (var i = 0; i < platformCount; i++) {
            var y = lastPlatform.y + platformStepY; 

            var distance = 70 + Math.random() * 60; 
            var angleChange = Math.PI / 4 + Math.random() * (Math.PI / 2); 
            
            var x = lastPlatform.x + distance * Math.cos(angleChange * i);
            var z = lastPlatform.z + distance * Math.sin(angleChange * i);

            // Narrow platformss tehe
            var pSize = 30; 

            colliders.push({
                position: { x: x, y: y, z: z },
                size: { width: pSize, height: 10, length: pSize },
                color: g.color(60, 100, 60) // green cuz they alive or something
            });

            lastPlatform = { x: x, y: y, z: z };
        }

        // Return the complete level object
        return {
            colliders: colliders,
            goal: {
                position: { x: lastPlatform.x, y: lastPlatform.y, z: lastPlatform.z },
                size: { width: 40, height: 40, length: 40 },
                color: g.color(150, 255, 150) // Green/life goal
            },

            background: color(40, 100, 140)
        };

    })());
    
    
    
        // Level 8: A Thing Called Color - vibrant colors
    levels.push((function() {
        var colliders = [];
        var initialY = 0;
        var platformStepY = -25;
        var platformCount = 67;
        var baseRadius = 100; 
        var radialGrowth = 5;
        var angleStep = Math.PI / 8;
        var lastPlatform = { x: 0, y: initialY, z: 0 };
        var platformSize = 50;

        // generate a random vibrant color
        function getRandomVibrantColor() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            
            // Ensure at least one primary color is bright to guarantee vibrancy
            if (r < 150 && g < 150 && b < 150) {
                 var choice = Math.floor(Math.random() * 3);
                 if (choice === 0) {r = 255;}
                 else if (choice === 1) {g = 255;}
                 else {b = 255;}
            }

            return color(r, g, b);
        }

        colliders.push({
            position: { x: lastPlatform.x, y: lastPlatform.y, z: lastPlatform.z },
            size: { width: 100, height: 10, length: 100 },
            color: getRandomVibrantColor()
        });

        for (var i = 1; i <= platformCount; i++) {
            var y = initialY + i * platformStepY; 
            
            var radius = baseRadius + i * radialGrowth; // Growing radius for spiral expand thing
            var angle = i * angleStep; 
            
            var x = radius * Math.cos(angle);
            var z = radius * Math.sin(angle);

            var pSize = platformSize + Math.random() * 20; 

            colliders.push({
                position: { x: x, y: y, z: z },
                size: { width: pSize, height: 10, length: pSize },
                color: getRandomVibrantColor() 
            });

            lastPlatform = { x: x, y: y, z: z };
        }

        // Return the complete level object per usual
        return {
            colliders: colliders,
            
            goal: {
                position: { x: lastPlatform.x, y: lastPlatform.y, z: lastPlatform.z },
                size: { width: 40, height: 40, length: 40 },
                color: g.color(0, 255, 0) 
            },

            background: color(10, 150, 200)
        };

    })());
    
    
        // Level 9: The Final Gate - open field w/ a couple trees and the last portal, which is magenta this time O: O: O: :D :D :D :DDDDDD
    levels.push((function() {
var colliders = [];
        colliders.push({
            position: { x: 0, y: 0, z: 0 },
            size: { width: 1500, height: 40, length: 1500 },
            color: g.color(50, 70, 40) 
        });


        colliders.push({
            position: { x: -300, y: -200, z: 200 },
            size: { width: 40, height: 360, length: 40 },
            color: g.color(50, 30, 10) 
        });

        colliders.push({
            position: { x: -300, y: -325, z: 200 }, 
            size: { width: 150, height: 150, length: 150 },
            color: g.color(30, 150, 30)
        });
        

        colliders.push({
            position: { x: 400, y: -280, z: -300 },
            size: { width: 50, height: 520, length: 50 },
            color: g.color(40, 20, 0) 
        });

        colliders.push({
            position: { x: 400, y: -600, z: -300 }, 
            size: { width: 200, height: 200, length: 200 },
            color: g.color(40, 180, 40) 
        });


        colliders.push({
            position: { x: -200, y: -35, z: 100 },
            size: { width: 60, height: 60, length: 60 },
            color: g.color(20, 100, 20) 
        });
        

        colliders.push({
            position: { x: 100, y: -45, z: -550 },
            size: { width: 80, height: 80, length: 80 },
            color: g.color(30, 120, 30)
        });

        
        // Return the complete level object
        return {
            colliders: colliders,
            goal: {
                position: { x: 0, y: -150, z: -600 },
                size: { width: 100, height: 100, length: 100 },
                color: g.color(255, 220, 0) // Magenta goal this time o:
            },

            background: color(0, 119, 255)
        };

    })());

}


// to check that ur not spawning in a wall
// ...that wouldn't be fun right
function safeSpawn(x, y, z) {
  for (var i = 0; i < colliders.length; i++) {
    var b = colliders[i];
    if (x > b.x && x < b.x + b.w &&
        z > b.z && z < b.z + b.d) {
      // inside something? lift player out
      y = b.h + 10; // place justttt above the block
    }
  }
  return {x:x, y:y, z:z};
}

// load a level
function loadLevel(levelIndex) {
    // Set the blocks and level to the level we are loading
    currentLevel = levelIndex;
    colliders = levels[levelIndex].colliders;
    goal = levels[levelIndex].goal;

    // Reset varibles so we don't spawn in like the air or something 
    var spawn = safeSpawn(initialPlayerX, initialPlayerY, initialPlayerZ);
    playerX = spawn.x;
    playerY = spawn.y;
    playerZ = spawn.z;

    isJumping = false;
    onGround = true;
    jumpSpeed = 0;
    camAngleY = 0;
    camAngleX = -15;
    playerRotationY = 0;
    currentDigitPosition = 0;
}

// collisions for all angles (horizontal and vertical)
function checkCollision(objX, objY, objZ, box) {
    // box bounds (X and Z)
    var boxMinX = box.position.x - box.size.width / 2;
    var boxMaxX = box.position.x + box.size.width / 2;
    var boxMinZ = box.position.z - box.size.length / 2;
    var boxMaxZ = box.position.z + box.size.length / 2;

    // player bounds (X and Z)
    var playerMinX = objX - playerSize / 2;
    var playerMaxX = objX + playerSize / 2;
    var playerMinZ = objZ - playerSize / 2;
    var playerMaxZ = objZ + playerSize / 2;

    // horizontal overlap (X & Z)
    var overlapsHorizontal = (playerMaxX >= boxMinX && playerMinX <= boxMaxX &&
                              playerMaxZ >= boxMinZ && playerMinZ <= boxMaxZ);

    // vertical extents (Y)
    var playerTop = objY - playerSize / 2;
    var playerBottom = objY + playerSize / 2;
    var boxTop = box.position.y - box.size.height / 2;
    var boxBottom = box.position.y + box.size.height / 2;

    // vertical overlap boolean (any overlap in Y)
    var overlapsVertical = (playerTop < boxBottom && playerBottom > boxTop);

    // Decide vertical collision type:
    // - "top"  -> landed on top of the box (moving downwards)
    // - "bottom" -> hit the bottom of the box (moving upwards)
    // - "none" -> no vertical hit of interest
    var vertical = "none";
    if (overlapsHorizontal) {
        if (typeof jumpSpeed !== "undefined" && jumpSpeed >= 0 && playerBottom >= boxTop && playerTop < boxTop) {
            vertical = "top";
        } else if (typeof jumpSpeed !== "undefined" && jumpSpeed < 0 && playerTop <= boxBottom && playerBottom > boxBottom) {
            vertical = "bottom";
        }
    }

    // horizontal "collision" the old checkHorizontalCollision returned true only if
    // horizontal area overlaps AND there's some vertical intersection (so you're in the same Y-band).
    var horizontal = overlapsHorizontal && overlapsVertical;

    return {
        horizontal: horizontal,
        vertical: vertical,           // "top" / "bottom" / "none"
        overlapsHorizontal: overlapsHorizontal,
        overlapsVertical: overlapsVertical,
        playerTop: playerTop,
        playerBottom: playerBottom,
        boxTop: boxTop,
        boxBottom: boxBottom
    };
}
// I used to have 2 functions, later consolidate it into just 1.
// Because I am lazy, I'll just make these so i don't have to change anything else.
function checkHorizontalCollision(objX, objY, objZ, box) {
    return checkCollision(objX, objY, objZ, box).horizontal;
}
function checkVerticalCollision(objX, objY, objZ, box) {
    return checkCollision(objX, objY, objZ, box).vertical;
}
// scope out
var scopeOut = function(p) { return function(){return this;}()[p]; };

// handle mouse movement
var handleMove = function(e) {
    // if mouse isn't locked we dont care at all    👇
    if (!scopeOut('document').pointerLockElement) {return;}
    camAngleY -= e.movementX * mouseSensitivity;
    camAngleX -= e.movementY * mouseSensitivity;
    camAngleX = constrain(camAngleX, camAngleXMin, camAngleXMax);
};
var scene = "title"; 

// Made it so when you press play it locks mouse for you
// Thank me later
var overPlayButton = false;
// when you click, lock mouse
var mousePressed = function() {
    // lock mouse if in game
    if (scene === "game"){
    scopeOut('document').getElementById('output-canvas').requestPointerLock();
    scopeOut('document').getElementById('output-canvas').onmousemove = handleMove;
    }
};

// store keys pressed
var keys = [];
// if key is pressed, act like it. If not, well... don't.
keyPressed = function() { keys[keyCode] = true; };
keyReleased = function() { keys[keyCode] = false; };

/**
 * This thing helps smoothly and coRRecTly interpolate between two angles, even when they cross the 0/360 degree boundary. 😎 (or at least it is supposed to)
 *
 *  a - starting angle, in degrees.
 *  b - target angle, in degrees.
 *  amount - A number between 0 and 1. how "far along" you are in the rotation. 0 is the start, 1 is the end, and 0.5 is halfway.
 * @returns {number} - The new angle, which is somewhere between a & b.
This took me as long as the collisions ):
 */
function lerpAngle(a, b, amount) {
  // first make sure both angles are between 0 and 360 degrees.
  //'%' (modulo) can return negative values for negative numbers, so we add 360 and take the modulo again
  var normalizedA = (a % 360 + 360) % 360;
  var normalizedB = (b % 360 + 360) % 360;
  
  // Next, we find the difference between the two angles
  var diff = normalizedB - normalizedA;
  
  // This is the juicy part
  // If the difference is more than 180 degrees, it's shorter to go the other way around the circle.
  if (abs(diff) > 180) {
    // If the difference is positive, we subtract a full circle from the target.
    // This makes the rotation go counter-clockwise (the shorter path).
    if (diff > 0) {
      normalizedA += 360;
    } else {
      // If the difference is negative, we subtract a full circle from the start.
      // This makes the rotation go clockwise (the shorter path).
      normalizedB += 360;
    }
  }
  // Now we do the actual interpolation
  // This is the classic linear interpolation formula.
  // We add a percentage of the (now shortest) difference to our starting point.
  // Finally, we bring the result back into the 0-360 range, just in case.
  return (normalizedA + (normalizedB - normalizedA) * amount) % 360;
  // Mission passed
  // Funny story: when i showed this to Kineto he did not understand any of it
}

// These functions are called once at the start of the game to set things up and prevent the first frame from being white and flashing you.
buildLevels();
loadLevel(currentLevel);

// TITLE SCREEN [

//Button stuff
var titleButtonCanClick = false;
var sceneToGo;
var titleButton = function(x, y, w, h, txt, scene){
    
    //Hitbox (or click box ig)
    if(mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h){
        //Shift buttons and grow them
        w+=10;
        h+=6;
        x-=5;
        y-=3;
        
        //Activate (potential) change
        titleButtonCanClick = true;
        sceneToGo = scene;
    }
    
    fill(0, 17, 255);
    rect(x, y, w, h, (w+h)/20);
    fill(255);
    textSize((w+h)/5.5);
    text(txt, x+w/2, y+h/2);
    
    
};

// Function to draw the title screen with two buttons (yay)
var drawTitleScreen = function() {
    background(0, 0, 0); // Black background
    
    fill(225);
    ellipse(width/2, height/2-50, 25, 25);
    for (var c = 0; c < 7; c++){
        
        noFill();
        strokeWeight(25.5);
        stroke(240, 240, 255-(c*25)-30, 220);
        ellipse(width/2, height/2-50, 50+50*c, 50+50*c);
        
    }
    
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    // Game Title
    textSize(70);
    text("PATH OF LIGHT", width / 2, height / 2 - 50);

    //Play Button
    titleButton(width / 2 - 175, height / 2 + 20, 150, 50, "Play", 'game');

    // How to Play Button
    fill(0, 17, 255);
    titleButton(width / 2 + 25, height / 2 + 20, 150, 50, "How", 'howToPlay');
};

// number of wave layers (for title)
var numOfWaves = 4;
// time for the waves
var time = 0;

noStroke();

// waves code from my "2d animated ocean" program
var drawWave = function(layerIndex) {
  var denominator = max(numOfWaves - 1, 1);

  var startColor = color(120, 160, 255);
  var endColor   = color(0, 40, 100);

  var waterColor = lerpColor(startColor, endColor, layerIndex / denominator);

  fill(waterColor);
  beginShape();
  vertex(-10, height);

  for (var x = 0; x <= width; x += 5) {
    var y = map(
      noise(x / 100, time + layerIndex),
      0, 1,
      height * (0.6 + layerIndex * 0.05),
      height * (0.8 + layerIndex * 0.05)
    );
    vertex(x, y);
  }

  vertex(width + 10, height);
  endShape(CLOSE);
};

// how to play screen
var drawHowToPlayScreen = function() {
    background(0, 0, 0); // Black background
        for (var i = 0; i < numOfWaves; i++) {
        drawWave(i); //now it draws the wave
    }
    
    time += 0.01; // animate waves
    
    fill(255);
    textAlign(LEFT, TOP);
    textSize(40);
    text("How to Play", 20, 30);

    textSize(20);
    text("Use W, A, S, D to move and SPACE to jump.", 20, 100);
    text("Use your mouse or arrow keys to look around.", 20, 140);
    text("Reach the green or magenta box to finish the level.", 20, 180);
    text("Don't fall into the void.", 20, 220);
    text("Press ENTER to save your game.", 20, 260);

    // Back Button
    fill(0, 17, 255);
    textAlign(CENTER, CENTER);
    titleButton(20, height - 60, 100, 40, 'Back', 'title');
};

//]

// handles mouse clicks
mouseClicked = function() {
    if (scene === "title" && titleButtonCanClick) {
        scene = sceneToGo;
        if(sceneToGo === 'game'){
            scopeOut('document').getElementById('output-canvas').requestPointerLock();
    scopeOut('document').getElementById('output-canvas').onmousemove = handleMove;
            loadLevel(currentLevel); // Starts the game directly
        }
    } else if (scene === "howToPlay") {
        // Check for "Back" button click
        if (mouseX > 20 && mouseX < 120 && mouseY > height - 60 && mouseY < height - 20) {
            scene = "title";
        }
    }
    // Handles clicking to continue after dying.
    if (dead) {
        if (mouseIsPressed){
            skullSize = 20000;
            skullTrans = 0;
            shakeIntensity = 25;
            deathAnimationFrames = 0;
            dead = false;
            loadLevel(currentLevel);
        }
    }
};

// Digits made all of these. He's really good at it which is somewhat scary.
var deathMessages = [
  "Maybe don't fall into the void?",
  "You've met a terrible fate, haven't you?",
  "Owchy! That must've hurt.",
  "Try again, but with less falling!",
  "Gravity pulls you DOWN, remeber?",
  "Well, that's one way to go.",
  "Another one bites the dust...",
  "The Devs probably need to patch that.",
  "W. A. S. T. E. D.",
  "Well, that was anticlimactic.",
  "We all make mistakes. Yours was this whole run.",
  "Please try again later. Much, much later.",
  "You're not Spider-Man. I'm not SurpremeChicken.",
  "What goes up must come down...",
  
];

// the current one
var currentDeathMessage = "";

// funciton to get a random funny death text lllloll
function selectRandomDeathMessage() {
    var randomIndex = floor(random(deathMessages.length)); 
    currentDeathMessage = deathMessages[randomIndex];
}

// call it so first death text exists
selectRandomDeathMessage();

// time for score
var TIME = saveCode[2] / PI;

// this is the big library/function thing
var WebGL2PostProcessingRenderer=function(FSH_SHADER_TYPE){
    var note='Made by Dat. For use with any WebGLRenderingContext, but made for P3D in the KA environment. Uses hyper-optimized WebGL2 code and context attributes. FSH_SHADER_TYPE is a case-insensitive string with values of "fxaa", "invert", "fake3d", or "swirl" as default example post-processing shaders. If not a type, it should be a #version 300 es GLSL post-processing fragment shader, with the uniform sampler2D being "tex" and varying being "pixTexCoord".';switch(FSH_SHADER_TYPE.toLowerCase()){default:break;case'fxaa':FSH_SHADER_TYPE='#version 300 es\nprecision lowp float;in vec2 pixTexCoord;uniform sampler2D tex;out vec4 fragColor;\n#define FXAA_SPAN_MAX 3.0\n#define FXAA_REDUCE_MUL 0.5\n#define FXAA_REDUCE_MIN 0.4\n#define FXAA_SUBPIX_SHIFT 0.1\nvec3 fxaaPixelShader(vec4 uv,sampler2D tex,vec2 rcpFrame){vec3 rgbNW=texture(tex,uv.zw).xyz;vec3 rgbNE=texture(tex,uv.zw+vec2(1,0)*rcpFrame.xy).xyz;vec3 rgbSW=texture(tex,uv.zw+vec2(0,1)*rcpFrame.xy).xyz;vec3 rgbSE=texture(tex,uv.zw+vec2(1,1)*rcpFrame.xy).xyz;vec3 rgbM=texture(tex,uv.xy).xyz;vec3 luma=vec3(0.299,0.587,0.114);float lumaNW=dot(rgbNW,luma);float lumaNE=dot(rgbNE,luma);float lumaSW=dot(rgbSW,luma);float lumaSE=dot(rgbSE,luma);float lumaM=dot(rgbM,luma);float lumaMin=min(lumaM,min(min(lumaNW,lumaNE),min(lumaSW,lumaSE)))*0.75;float lumaMax=max(lumaM,max(max(lumaNW,lumaNE),max(lumaSW,lumaSE)))*1.25;vec2 dir=vec2((lumaSW+lumaSE)-(lumaNW+lumaNE),(lumaNW+lumaSW)-(lumaNE+lumaSE));float dirReduce=max((lumaNW+lumaNE+lumaSW+lumaSE)*FXAA_REDUCE_MUL,FXAA_REDUCE_MIN);float rcpDirMin=2.0/(min(abs(dir.x),abs(dir.y))+dirReduce);dir=min(vec2(FXAA_SPAN_MAX,FXAA_SPAN_MAX),max(vec2(-FXAA_SPAN_MAX,-FXAA_SPAN_MAX),dir*rcpDirMin))*rcpFrame.xy*0.5;vec3 rgbA=0.5*(texture(tex,uv.xy+dir*-0.16666667).xyz +texture(tex,uv.xy+dir*-0.16666667).xyz);vec3 rgbB=rgbA*0.5+0.25*(texture(tex,uv.xy-dir).xyz+texture(tex,uv.xy+dir).xyz);float lumaB=dot(rgbB,luma);if(lumaB<lumaMin || lumaB>lumaMax) return rgbB;return rgbB;}void main(){vec2 rcpFrame=vec2(1.0/WIDTH,1.0/HEIGHT)*2.0;vec2 uv2=pixTexCoord;vec4 uv=vec4(uv2,uv2-(rcpFrame*FXAA_SUBPIX_SHIFT));vec3 col=fxaaPixelShader(uv,tex,rcpFrame);fragColor=vec4(col,1);}'.replaceAll('WIDTH',width+0.001).replaceAll('HEIGHT',height+0.001);break;case'invert':FSH_SHADER_TYPE='#version 300 es\nprecision lowp float;in vec2 pixTexCoord;uniform sampler2D tex;out vec4 fragColor;void main(){fragColor=vec4(1.0-texture(tex,pixTexCoord).rgb,1);}';break;case'fake3d':FSH_SHADER_TYPE='#version 300 es\nprecision lowp float;in vec2 pixTexCoord;uniform sampler2D tex;out vec4 fragColor;void main(){fragColor=vec4(texture(tex,pixTexCoord+vec2(0.008,0)).r,texture(tex,pixTexCoord-vec2(0.008,0)).gb,1);}';break;case'swirl':FSH_SHADER_TYPE='#version 300 es\nprecision lowp float;in vec2 pixTexCoord;uniform sampler2D tex;out vec4 fragColor;void main(){vec2 pos=pixTexCoord-0.5;float t=length(pos)*7.9;vec2 c=vec2(cos(t),sin(t));pos=vec2(pos.x*c.x-pos.y*c.y,pos.x*c.y+pos.y*c.x);fragColor=vec4(texture(tex,pos+0.5).rgb,1);}';break;}var win=(function(){return this;})();var Float32=(function(){var evl='eval';return win[evl]('a=>new Float32Array(a)');})();var Uint16=(function(){var evl='eval';return win[evl]('a=>new Uint16Array(a)');})();var Uint8=(function(){var evl='eval';return win[evl]('a=>new Uint8Array(a)');})();var gl=(function(){var evl='eval';return win[evl]('var a=document.createElement("canvas");a.getContext("webgl2",{antialiasing:false,alpha:false})');})();gl.canvas.width=width;gl.canvas.height=height;gl.viewport(0,0,width,height);var vsh=gl.createShader(35633),fsh=gl.createShader(35632);gl.shaderSource(vsh,'#version 300 es\nprecision mediump float;in vec2 v;out vec2 pixTexCoord;void main(){pixTexCoord=v*0.5+0.5;gl_Position=vec4(v,0,1.0);}');gl.shaderSource(fsh,FSH_SHADER_TYPE);gl.compileShader(vsh);gl.compileShader(fsh);var pro=gl.createProgram();gl.attachShader(pro,vsh);gl.attachShader(pro,fsh);gl.linkProgram(pro);gl.useProgram(pro);var vB=gl.createBuffer();gl.bindBuffer(34962,vB);gl.bufferData(34962,Float32([-1,-1,1,-1,1,1,-1,1]),35044);var iB=gl.createBuffer();gl.bindBuffer(34963,iB);gl.bufferData(34963,Uint16([0,1,2,0,2,3]),35044);var vLoc=gl.getAttribLocation(pro,'v');gl.vertexAttribPointer(vLoc,2,5126,0,8,0);gl.enableVertexAttribArray(vLoc);var texture=gl.createTexture();gl.bindTexture(3553,texture);gl.texParameteri(3553,10242,33071);gl.texParameteri(3553,10243,33071);gl.texParameteri(3553,10241,9729);gl.texParameteri(3553,10240,9729);gl.texImage2D(3553,0,6408,width,height,0,6408,5121,null);this.canvas=gl.canvas;var pixels=Uint8((width*height)<<2);this.applyPostProcessing=function(){this.context.readPixels(0,0,width,height,6408,5121,pixels);gl.texSubImage2D(3553,0,0,0,width,height,6408,5121,pixels);gl.drawElements(4,6,5123,0);};this.setInputContext=function(g){this.context=g;};this.context=gl;};

// the mode can be "fxaa", "invert", "fake3d", or "swirl" for cool wonky shader effects. 

var MODE='fxaa';

// create the rendering program, this one is named "Renderer"
var Renderer=new WebGL2PostProcessingRenderer(MODE);

// set the Renderer's input context as P3D's WebGL context
Renderer.setInputContext(g.externals.context);


// draw function
draw = function() {
    
    // savecode
    if (keys[ENTER]) {
        _clearLogs();
        println("// Replace the variable saveCode with this one.\nvar saveCode = [0, " + (currentLevel * 3) + ", " + TIME * PI + ", 5];");
    
    } if (scene === "title") {
        drawTitleScreen();
    } else if (scene === "howToPlay") {
        drawHowToPlayScreen();
    
    // lame win scene
    } else if (scene === "won") {
        background(0);
        textAlign(CENTER, CENTER);
        textSize(100);
        text("YOU WON!", 300, 250);
        textSize(30);
        fill(166, 0, 255);
        text("TIME: " + formatNumber(round(TIME/60)), 300, 350);
        text("Not many players win, congrats!", 300, 400);
        text("Spin-off and I'll add you to leaderboard", 300, 450);
        noLoop();
    }
    
    else {
    TIME ++;
    // we gotta put g. before anything that is (like a cube) or interacts with (like rotations) with the 3d world.
    // Believe me, it's annoying
    // and python ppl think semicolons are bad
    
    // background for 3d
    // When setting background for the level
    if (levels[currentLevel] && levels[currentLevel].background) {
        var c = levels[currentLevel].background; // g.color(r, g, b)
        g.background(c); // decompose to RGB
    } else {
        g.background(0); // fallback
    }
    // outlines if outlines
    if (showOutlines) {
        g.strokeWeight(1);
        g.stroke(1);
    }
    // no if no
    else {
        g.noStroke();
    }
    // Save the player's position before moving them. We'll need this later to "undo" a move if we run into a wall. (To prevent getting partway inside)
    prevPlayerX = playerX;
    prevPlayerZ = playerZ;
    prevPlayerY = playerY;

    // --- player movement ---
    var forwardDirX = sin(camAngleY), forwardDirZ = cos(camAngleY);
    var hasInput = false, targetRotationY = playerRotationY;
    var desiredVelocityX = 0, desiredVelocityZ = 0;
    var rotationAccumulator = 0;
    var rotationCount = 0;

    // This section checks which direction keys (W, A, S, D) are being pressed.
    // It calculates the "desired" movement direction and rotation.
    if (keys[87]) { desiredVelocityX -= forwardDirX; desiredVelocityZ -= forwardDirZ; rotationAccumulator += camAngleY; rotationCount++; hasInput = true; } // W
    if (keys[83]) { desiredVelocityX += forwardDirX; desiredVelocityZ += forwardDirZ; rotationAccumulator += camAngleY + 180; rotationCount++; hasInput = true; } // S
    if (keys[65]) { desiredVelocityX -= forwardDirZ; desiredVelocityZ += forwardDirX; rotationAccumulator += camAngleY + 90; rotationCount++; hasInput = true; } // A
    if (keys[68]) { desiredVelocityX += forwardDirZ;
    desiredVelocityZ -= forwardDirX;
    // Bug fix
    if (keys[83]) {
        rotationAccumulator += camAngleY + 270;
    }
    else {
        rotationAccumulator += camAngleY - 90;
    }
    rotationCount++;
    hasInput = true;
    
    } // D


    // If the player is giving input, figure out their new target rotation
    if (rotationCount > 0) {
        targetRotationY = rotationAccumulator / rotationCount;
    }
    
    // This adjusts the player's speed based on their input
    var magnitude = sqrt(desiredVelocityX * desiredVelocityX + desiredVelocityZ * desiredVelocityZ);
    if (magnitude > 0) {
        // If they're pressing a direction, add acceleration
        desiredVelocityX /= magnitude; desiredVelocityZ /= magnitude;
        playerVelocityX += desiredVelocityX * acceleration;
        playerVelocityZ += desiredVelocityZ * acceleration;
    } else {
        // If they're not, apply fricton to slow them down
        playerVelocityX *= friction; playerVelocityZ *= friction;
        if (abs(playerVelocityX) < 0.1) {playerVelocityX = 0;}
        if (abs(playerVelocityZ) < 0.1) {playerVelocityZ = 0;}
    }

    // Make sure the player's speed doesn't go over the max
    var currentSpeed = sqrt(playerVelocityX * playerVelocityX + playerVelocityZ * playerVelocityZ);
    if (currentSpeed > maxSpeed) {
        playerVelocityX = (playerVelocityX / currentSpeed) * maxSpeed;
        playerVelocityZ = (playerVelocityZ / currentSpeed) * maxSpeed;
    }

    // --- handle horizontal collisions ---
    // Apply movement and then check for collisions on each axis (X and Z) separately.
    // this prevents the player from getting "stuck" on a corner.
    // Check X-axis movement and collision
    playerX += playerVelocityX;
    for (var i = 0; i < colliders.length; i++) {
        var c = colliders[i];
        if (checkHorizontalCollision(playerX, prevPlayerY, prevPlayerZ, c)) {
            playerX = prevPlayerX; // If there's a collision, reset X position.
            playerVelocityX = 0; // Stop X-axis movement.
        }
    }
    // Check Z-axis movement and collision
    playerZ += playerVelocityZ;
    for (var i = 0; i < colliders.length; i++) {
        var c = colliders[i];
        if (checkHorizontalCollision(prevPlayerX, prevPlayerY, playerZ, c)) {
            playerZ = prevPlayerZ; // If there's a collision, reset Z position.
            playerVelocityZ = 0; // Stop Z-axis movement.
        }
    }
    
    // player rotation
    // Smoothly rotate the player towards the direction they're moving using lerpAngle.
    if (hasInput) {playerRotationY = lerpAngle(playerRotationY, targetRotationY, 0.1);} // 0.1 right now, the lower that value is the slower the rotation occors.
    // Handle gravity and vertical movement
    if (!onGround) { playerY += jumpSpeed; jumpSpeed += gravity; }

    // Handle verdical collision & jumping
    // Check for collisions with the top or bottom of boxes
    var isCurrentlyOnSurface = false;
    for (var i = 0; i < colliders.length; i++) {
        var c = colliders[i];
        var verticalResult = checkVerticalCollision(playerX, playerY, playerZ, c);
        if (verticalResult === "top") {
            // Landed on a box
            playerY = c.position.y - c.size.height / 2 - playerSize / 2;
            isJumping = false; onGround = true; jumpSpeed = 0; isCurrentlyOnSurface = true;
        } else if (verticalResult === "bottom") {
            // Hit a box from underneath
            playerY = c.position.y + c.size.height / 2 + playerSize / 2; jumpSpeed = 0;
        }
    }
    onGround = isCurrentlyOnSurface;
    // Check for jump input, and only jump if allowed
    if (keys[32] && onGround) { isJumping = true; onGround = false; jumpSpeed = -8; }
    // If the player falls too far, DIE
    if (playerY > fallResetY) {dead = true;}
    // Check if the player has reached the goal.
    if (goal && checkHorizontalCollision(playerX, playerY, playerZ, goal)) {
        txtFade = 0;
        if (currentLevel < levels.length - 1) {
            loadLevel(currentLevel + 1); // if so, load the next level
        } else {
            scene = "won";
        }
    }

    // --- handle camera ---
    // Some remains of when i attept to make it not phase through walls remain
    var camTargetX = playerX;
    var camTargetY = playerY + camYOffset;
    var camTargetZ = playerZ;
    var camIdealX = camTargetX + camDist * sin(camAngleY) * cos(camAngleX);
    var camIdealZ = camTargetZ + camDist * cos(camAngleY) * cos(camAngleX);
    var camIdealY = camTargetY + camDist * sin(camAngleX);
    
    // set the camera's final position and what it's looking at
    g.camera(camIdealX, camIdealY, camIdealZ, playerX, playerY, playerZ, 0, 1, 0);

    // ---- draw the game wrld ---
    // Draw all the boxes
    for (var i = 0; i < colliders.length; i++) {
        var c = colliders[i];
        g.fill(c.color); g.pushMatrix(); g.translate(c.position.x, c.position.y, c.position.z);
        if (c.size.height === 1) { g.rotateX(radians(90)); g.box(c.size.width, c.size.length, c.size.height); }
        else { g.box(c.size.width, c.size.height, c.size.length); }
        g.popMatrix();
    }
    // Draw the goal
    if (goal) {
        g.fill(goal.color); g.pushMatrix();
        g.translate(goal.position.x, goal.position.y, goal.position.z);
        g.box(goal.size.width, goal.size.height, goal.size.length);
        g.popMatrix();
    }
    g.pushMatrix();
    g.translate(playerX, playerY, playerZ);
    g.rotateY(radians(playerRotationY));

    // Draw the player
    g.fill(0, 60, 255);
    g.box(playerSize, playerSize, playerSize);
    
    g.translate(0, 0, -playerSize/2 - 0.1);
    // Draw the cute face
    drawFace(0, 0, playerSize/4);
    
    g.popMatrix(); // End of the player stuff
    
    
    Renderer.applyPostProcessing();
    // Copy the graphics buffer to the screen
    externals.context.drawImage(Renderer.canvas,0,0);
    
    var messageToShow = levelPoems[currentLevel].substring(0, currentDigitPosition);
    
    txtFade+=2;
    
    //Poem that shows up
    fill(0, 0, 0, 100);
    rect(width/5, -100, width/1.7, height/3, 10);
    
    fill(255, 255, 255, txtFade);
    textAlign(CENTER);
    textSize(22);
    text(levelNames[currentLevel], width/2, height/18);
    
    textSize(15);
    text(messageToShow, width/2, height/11);
    if (currentDigitPosition < levelPoems[currentLevel].length && frameCount % 3 === 0 && txtFade > 255) {
        currentDigitPosition++;
    }
    // if you are dead draw the amazing helpful tip and the animation
    if (dead) {
    // Draw the death animation
    if(deathAnimationFrames > 20 && deathAnimationFrames < 100){
        if(shakeIntensity > 1){
        shakeX = random(-shakeIntensity, shakeIntensity);
        shakeY = random(-shakeIntensity, shakeIntensity);
        }
        shakeIntensity-=0.6;
    }
    noStroke();
    fill(0, innerCircleSize * 2);
    ellipse(300, 300, innerCircleSize-1, innerCircleSize-1);
    innerCircleSize = deathAnimationFrames * 30;
    fill(255, 255, 255, skullTrans);
    drawSkull(300 + shakeX, 300 + shakeY, skullSize*1.5);
    fill(0, 0, 0, skullTrans*2);
    drawEye(300 + shakeX, 300 + shakeY, skullSize*1.5);
    fill(0, 255, 191, gameOverTextTransparency);
    textSize(80);
    textAlign(CENTER, CENTER);
    text("You Died", 300, 280);
    textSize(25);
    fill(41, 230, 224, gameOverTextTransparency-255);
    text(currentDeathMessage, 300, 340);
    fill(214, 7, 7, gameOverTextTransparency - 500);
    textSize(45);
    text("- Click to Continue -", 300, 400);
    if(deathAnimationFrames < 100 && skullTrans < 255){
        skullTrans+=10;
    }
    if(deathAnimationFrames < 100 && skullSize > 200){
        skullSize /= 1.3;
    }
    if(deathAnimationFrames > 120){
        skullSize += 10;
        skullTrans -= 10;
        gameOverTextTransparency += 5;
        if(mouseIsPressed){
         skullSize = 20000;
         skullTrans = 0;
         shakeIntensity = 25;
         deathAnimationFrames = 0;
         gameOverTextTransparency = 1;
         innerCircleSize = 1;
         loadLevel(currentLevel);
         selectRandomDeathMessage();
         dead = false;
        }
    }
    
    deathAnimationFrames++;
    
    
    }
    }
};

// Not too long, most the code is the levels & comments anyway
