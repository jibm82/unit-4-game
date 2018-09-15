var game = {
    characters: [
        {
            name: 'Luke',
            slug: 'luke',
            healthPoints: 110,
            attackPower: 15,
            counterAttackPower: 5
        },
        {
            name: 'Yoda',
            slug: 'yoda',
            healthPoints: 120,
            attackPower: 8,
            counterAttackPower: 10
        },
        {
            name: 'Vader',
            slug: 'vader',
            healthPoints: 170,
            attackPower: 10,
            counterAttackPower: 25
        },
        {
            name: 'Darth Sidious',
            slug: 'darth-sidious',
            healthPoints: 150,
            attackPower: 10,
            counterAttackPower: 20
        }
    ],

    currentEnemy: undefined,
    playerCharacter: undefined,
    ui: {
        imagesDirectory: 'assets/images/'
    },
    selectableEnemies: [],

    new: function () {

        this.reset();

        $("#characters").on("click", ".character", function () {
            var slug = $(this).data("slug");

            if (game.hero === undefined) {
                game.selectHero(slug);
                game.populateSelectableEnemies();
                game.writeMessage("Choose your enemy", "big", true);
                $(this).remove();
            } else if (game.currentEnemy === undefined) {
                game.selectEnemy(slug);
                $(this).remove();
            }
        });

        $("#attack").click(function () {
            if (game.hero !== undefined && game.currentEnemy !== undefined) {
                game.playerAttack();
                game.enemyAttack();

                if (game.isCurrentEnemyDefeated()) {
                    var message = 'You defeated ' + game.currentEnemy.name;
                    game.writeMessage(message, "player", true);

                    game.currentEnemy = undefined;
                    game.setPlaceholder($("#enemy"));

                } else if (game.isPlayerDefeated()) {
                    var message = 'You were defeated by ' + game.currentEnemy.name;
                    game.writeMessage(message, "enemy", true);

                    game.hero = undefined;
                    game.setPlaceholder($("#hero"));
                }

                if (game.isGameOver()) {
                    $("#attack").addClass("hidden");
                    $("#reset").removeClass("hidden");
                    var message = 'Press the reset button to start a new game'
                    game.writeMessage(message, "", false);
                }
            }
        });

        $("#reset").click(function () {
            game.reset();
        });
    },

    reset: function () {
        // Variables reset
        this.currentEnemy = undefined;
        this.playerCharacter = undefined;
        this.selectableEnemies = [];

        // UI reset
        this.setPlaceholder($("#hero"));
        this.setPlaceholder($("#enemy"));

        this.writeMessage("Choose your hero", "big", true);

        $('.character').remove();
        $('.action').addClass("hidden");
        $.each(this.characters, function (index, character) {
            $("#characters").append(game.characterCover(index, character));
        });
    },

    cloneCharacter: function (character) {
        var clone = {
            name: character.name,
            slug: character.slug,
            healthPoints: character.healthPoints,
            attackPower: character.attackPower,
            counterAttackPower: character.counterAttackPower
        }

        return clone;
    },

    selectHero: function (slug) {
        var character = this.findCharacterInArray(slug, this.characters);
        this.hero = this.cloneCharacter(character);
        this.hero.currentAttackPower = this.hero.attackPower;
        this.displayHero();
        console.log("You selected " + this.hero.name);
    },

    findCharacterInArray: function (slug, stack) {
        return stack.filter(function (character) {
            return character.slug === slug;
        })[0];
    },

    populateSelectableEnemies: function () {
        this.selectableEnemies = [];

        $.each(this.characters, function (index, character) {
            if (character.name !== game.hero.name) {
                enemy = game.cloneCharacter(character);
                game.selectableEnemies.push(enemy);
            }
        });
    },

    selectEnemy: function (slug) {
        this.currentEnemy = this.findCharacterInArray(slug, this.selectableEnemies);
        this.displayEnemy();

        this.selectableEnemies = this.selectableEnemies.filter(function (enemy) {
            return game.currentEnemy.name !== enemy.name;
        });
        $("#attack").removeClass("hidden");
        game.writeMessage("FIGHT", "big", true);
    },

    playerAttack: function () {
        var damage = this.hero.currentAttackPower;
        this.currentEnemy.healthPoints -= damage;
        this.hero.currentAttackPower += this.hero.attackPower;

        var message = "You attacked " + this.currentEnemy.name + " for " + damage + " damage";
        game.writeMessage(message, "player", true);
    },

    enemyAttack: function () {
        var damage = this.currentEnemy.counterAttackPower;
        this.hero.healthPoints -= damage;
        var message = this.currentEnemy.name + " attacked you for " + damage + " damage";
        game.writeMessage(message, "enemy", false);
    },

    isPlayerDefeated: function () {
        return this.hero.healthPoints <= 0;
    },

    isCurrentEnemyDefeated: function () {
        return this.currentEnemy.healthPoints <= 0;
    },

    isGameOver: function () {
        return this.hero === undefined || this.selectableEnemies.size === 0;
    },

    /*UI methods*/

    characterCover: function (index, character) {
        var cover = $("<div>")
            .addClass("character")
            .data("name", character.name)
            .data("hp", character.healthPoints)
            .data("slug", character.slug)

        cover.append(this.characterImage(character, "small"));
        cover.append($("<p>").text("HP " + character.healthPoints));

        return cover;
    },

    characterHeader: function (character) {
        return $("<h3>").html(character.name + " - HP <span>" + character.healthPoints + "</span>");
    },

    characterImage: function (character, version) {
        var src = game.ui.imagesDirectory + character.slug + "-" + version + ".png";
        var image = $("<img>").attr("src", src).attr("alt", character.name);

        return image;
    },

    displayHero: function () {
        $('#hero img').remove();
        $('#hero').append(this.characterHeader(this.hero));
        $("#hero").append(this.characterImage(this.hero, "hero"));
    },

    displayEnemy: function () {
        $('#enemy img').remove();
        $('#enemy').append(this.characterHeader(this.currentEnemy));
        $("#enemy").append(this.characterImage(this.currentEnemy, "enemy"));
    },

    setPlaceholder: function (container) {
        var placeholder = $("<img>").attr("src", game.ui.imagesDirectory + "placeholder.png");
        container.html(placeholder);
    },

    shakeCharacterImage: function (image) {
        var goLeft = true;
        var times = 5;
        image.css("position", "relative");
        var interval = setInterval(function () {
            if (times > 0) {
                if (goLeft) {
                    image.css("left", "10px");
                } else {
                    image.css("left", "0px");
                }

                goLeft = !goLeft;
                times--;
            } else {
                clearInterval(interval);
            }
        }, 30);
    },

    writeMessage: function (text, messageClass, wipeMessages) {
        if (wipeMessages === true) {
            $("#messages div").remove();
        }

        var message = $("<div>")
            .addClass(messageClass)
            .text(text);

        $("#messages").append(message);
    }
}

game.new();