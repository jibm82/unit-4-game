var game = {
    characters: [
        {
            name: 'Obi-Wan',
            healthPoints: 100,
            attackPower: 10,
            counterAttackPower: 100
        },
        {
            name: 'Luke',
            healthPoints: 100,
            attackPower: 10,
            counterAttackPower: 100
        }
    ],

    currentEnemy: undefined,
    playerCharacter: undefined,
    selectableEnemies: [],

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

        this.selectableEnemies = this.selectableEnemies.filter(function (enemy) {
            return game.currentEnemy.name !== enemy.name;
        });
    },

    playerAttack: function () {
        this.currentEnemy.healthPoints -= this.playerCharacter.currentAttackPower;
        this.playerCharacter.currentAttackPower += this.playerCharacter.attackPower;
    },

    enemyAttack: function () {
        this.playerCharacter.healthPoints -= this.currentEnemy.counterAttackPower;
    },

    isPlayerDefeated: function () {
        return this.playerCharacter.healthPoints <= 0;
    },

    isCurrentEnemyDefeated: function () {
        return this.currentEnemy.healthPoints <= 0;
    }
}