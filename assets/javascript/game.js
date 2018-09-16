var game = {
    characters: [
        {
            name: 'Luke',
            slug: 'luke',
            healthPoints: 100,
            attackPower: 14,
            counterAttackPower: 10
        },
        {
            name: 'Yoda',
            slug: 'yoda',
            healthPoints: 140,
            attackPower: 8,
            counterAttackPower: 30
        },
        {
            name: 'Vader',
            slug: 'vader',
            healthPoints: 170,
            attackPower: 8,
            counterAttackPower: 20
        },
        {
            name: 'Darth Sidious',
            slug: 'darth-sidious',
            healthPoints: 120,
            attackPower: 12,
            counterAttackPower: 15
        }
    ],

    ui: {
        imagesDirectory: 'assets/images/'
    },

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
            if (game.animationInProgress === false && game.hero !== undefined && game.currentEnemy !== undefined) {
                game.playerAttack();
                if (game.isCurrentEnemyDefeated()) {
                    var message = 'You defeated ' + game.currentEnemy.name;

                    if (game.selectableEnemies.length > 0) {
                        message += ", choose another enemy";
                    }

                    game.writeMessage(message, "player", false);

                    game.currentEnemy = undefined;
                    game.setPlaceholder($("#enemy"));

                    game.checkIfGameIsOver();
                } else {

                    //Timeout for animations
                    setTimeout(function () {
                        game.enemyAttack();

                        if (game.isPlayerDefeated()) {
                            game.hero = undefined;
                            game.setPlaceholder($("#hero"));
                        }

                        game.checkIfGameIsOver();
                    }, 500);
                }
            }
        });

        $("#reset").click(function () {
            game.reset();
        });
    },

    reset: function () {
        // Variables reset
        this.animationInProgress = false;
        this.currentEnemy = undefined;
        this.hero = undefined;
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

    checkIfGameIsOver: function () {
        if (this.isGameOver()) {

            $("#characters .character").remove();
            $("#attack").addClass("hidden");
            $("#reset").removeClass("hidden");

            var message = "";
            var messageClass = "";

            if (game.hero !== undefined) {
                message = "You Win!";
                messageClass = "player";

            } else {
                message = "You Lose!";
                messageClass = "enemy";
            }
            game.writeMessage(message, "big " + messageClass, true);

            message = 'Press the reset button to start a new game'
            game.writeMessage(message, "medium", false);
        }
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
        game.writeMessage("Press the attack button to start fighting", "medium", true);
    },

    playerAttack: function () {
        var damage = this.hero.currentAttackPower;
        this.currentEnemy.healthPoints -= damage;
        this.hero.currentAttackPower += this.hero.attackPower;

        this.updateCharacterHealthPoints($("#enemy"), this.currentEnemy.healthPoints);

        this.shakeCharacterImage($("#enemy img"));

        var message = "You attacked " + this.currentEnemy.name + " for " + damage + " damage";
        game.writeMessage(message, "player", true);
    },

    enemyAttack: function () {
        var damage = this.currentEnemy.counterAttackPower;
        this.hero.healthPoints -= damage;

        this.updateCharacterHealthPoints($("#hero"), this.hero.healthPoints);

        this.shakeCharacterImage($("#hero img"));

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
        return this.hero === undefined || (this.selectableEnemies.length === 0 && this.currentEnemy === undefined);
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
        return $("<h3>").html(character.name + "<br/>HP <span class='hp'>" + character.healthPoints + "</span>");
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
        game.animationInProgress = true;
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
                game.animationInProgress = false;
            }
        }, 30);
    },

    updateCharacterHealthPoints: function (container, healthPoints) {
        container.find("span").text(healthPoints);
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