var game = {
    characters: [
        {
            name: 'Luke',
            slug: 'luke',
            healthPoints: 120,
            attackPower: 10,
            counterAttackPower: 10
        },
        {
            name: 'Yoda',
            slug: 'yoda',
            healthPoints: 100,
            attackPower: 10,
            counterAttackPower: 20
        },
        {
            name: 'Vader',
            slug: 'vader',
            healthPoints: 100,
            attackPower: 10,
            counterAttackPower: 50
        },
        {
            name: 'Darth Sidious',
            slug: 'darth-sidious',
            healthPoints: 100,
            attackPower: 10,
            counterAttackPower: 50
        }
    ],

    currentEnemy: undefined,
    playerCharacter: undefined,
    ui: {
        imagesDirectory: 'assets/images/'
    },
    selectableEnemies: [],

    new: function () {

        $('.character').remove();

        $.each(this.characters, function (index, character) {
            $("#characters").append(game.characterCover(index, character));
        });

        $("#characters").on("click", ".character", function () {
            var slug = $(this).data("slug");

            if (game.hero === undefined) {
                game.selectHero(slug);
                game.populateSelectableEnemies();
                $(this).remove();
            } else if (game.currentEnemy === undefined) {
                game.selectEnemy(slug);
                $(this).remove();
            }
        });

        $("#characters").on("mouseover", ".character", function () {
            if (game.hero === undefined || game.currentEnemy === undefined) {
                var stats = $(this).data("name") + " - HP " + $(this).data("hp");
                $("#character-stats").text(stats);
            }
        });

        $("#characters").on("mouseout", ".character", function () {
            $("#character-stats").text("");
        });

        $("#attack").click(function () {
            if (game.playerCharacter !== undefined && game.currentEnemy !== undefined) {
                game.playerAttack();
                game.enemyAttack();

                if (game.isCurrentEnemyDefeated()) {
                    console.log('You defeated ' + game.currentEnemy.name);
                    game.currentEnemy = undefined;
                    $("#current-enemy-container .character").remove();
                } else if (game.isPlayerDefeated()) {
                    console.log('You loose');
                    game.playerCharacter = undefined;
                } else {

                }
            }
        });
    },

    reset: function () {
        this.currentEnemy = undefined;
        this.playerCharacter = undefined;
        this.selectableEnemies = [];
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

        console.log("You choose to fight " + this.currentEnemy.name);
    },

    playerAttack: function () {
        var damage = this.playerCharacter.currentAttackPower;
        this.currentEnemy.healthPoints -= damage;
        this.playerCharacter.currentAttackPower += this.playerCharacter.attackPower;

        console.log("You attacked " + this.currentEnemy.name + " for " + damage + " damage");
    },

    enemyAttack: function () {
        var damage = this.currentEnemy.counterAttackPower;
        this.playerCharacter.healthPoints -= damage;
        console.log(this.currentEnemy.name + " attacked you for " + damage + " damage");
    },

    isPlayerDefeated: function () {
        return this.playerCharacter.healthPoints <= 0;
    },

    isCurrentEnemyDefeated: function () {
        return this.currentEnemy.healthPoints <= 0;
    },

    /*UI methods*/

    characterCover: function (index, character) {
        var cover = $("<div>")
            .addClass("character")
            .data("name", character.name)
            .data("hp", character.healthPoints)
            .data("slug", character.slug)

        cover.append(this.characterImage(character, "small"));

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
        $('#hero').append(this.characterHeader(this.hero));
        $("#hero").append(this.characterImage(this.hero, "hero"));
    },

    displayEnemy: function () {
        $('#enemy').append(this.characterHeader(this.currentEnemy));
        $("#enemy").append(this.characterImage(this.currentEnemy, "enemy"));
    }
}

game.new();