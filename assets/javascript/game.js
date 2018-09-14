var game = {
    characters: [
        {
            name: 'Obi-Wan',
            healthPoints: 120,
            attackPower: 10,
            counterAttackPower: 10
        },
        {
            name: 'Luke',
            healthPoints: 100,
            attackPower: 10,
            counterAttackPower: 20
        },
        {
            name: 'Darth Vader',
            healthPoints: 100,
            attackPower: 10,
            counterAttackPower: 50
        }
    ],

    currentEnemy: undefined,
    playerCharacter: undefined,
    selectableEnemies: [],

    new: function () {

        $('.character').remove();

        $.each(this.characters, function (index, character) {
            $("#characters").append(game.renderedCharacter(index, character));
        });

        $(document).on("click", ".character", function () {
            if (game.playerCharacter === undefined) {
                var index = $(this).data("id");
                game.selectCharacter(index);

                $('.character').remove();

                var renderedPlayerCharacter = game.renderedCharacter(index, game.playerCharacter);
                $('#characters')
                    .addClass("player-selected")
                    .append(renderedPlayerCharacter);

                $.each(game.selectableEnemies, function (index, enemy) {
                    var renderedEnemy = game.renderedCharacter(index, enemy)
                    $('#selectable-enemies').append(renderedEnemy);
                });
            } else if (game.currentEnemy === undefined) {
                var index = $(this).data("id");
                game.selectEnemy(index);

                $("#selectable-enemies .character").remove();

                var renderedCurrentEnemy = game.renderedCharacter(index, game.currentEnemy);
                $('#current-enemy-container').append(renderedCurrentEnemy);

                $.each(game.selectableEnemies, function (index, enemy) {
                    var renderedEnemy = game.renderedCharacter(index, enemy)
                    $('#selectable-enemies').append(renderedEnemy);
                });
            }
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
            healthPoints: character.healthPoints,
            attackPower: character.attackPower,
            counterAttackPower: character.counterAttackPower
        }

        return clone;
    },

    selectCharacter: function (index) {
        this.playerCharacter = this.cloneCharacter(this.characters[index]);
        this.playerCharacter.currentAttackPower = this.playerCharacter.attackPower;
        console.log("You selected " + this.playerCharacter.name);

        this.populateEnemies();
    },

    populateEnemies: function () {
        this.selectableEnemies = [];

        $.each(this.characters, function (index, character) {
            if (character.name !== game.playerCharacter.name) {
                enemy = game.cloneCharacter(character);
                game.selectableEnemies.push(enemy);
            }
        });
    },

    selectEnemy: function (index) {
        this.currentEnemy = this.selectableEnemies[index];
        console.log("You choose to fight " + this.currentEnemy.name);

        this.selectableEnemies = this.selectableEnemies.filter(function (enemy) {
            return game.currentEnemy.name !== enemy.name;
        });
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

    renderedCharacter: function (index, character) {
        var characterContainer = $("<div>")
            .addClass("character")
            .data("id", index)
            .text(character.name);

        return characterContainer;
    }
}

game.new();