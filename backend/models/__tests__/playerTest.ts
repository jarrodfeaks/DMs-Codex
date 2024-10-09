import { Player } from '../playerModel';
import { Status }from '../../../shared/enums';

const createPlayer = async () => {
    const player = new Player({
        name: 'Player 1',
        hitpoints: 10,
        armor: 3,
        strength: 10,
        dexterity: 10,
        intelligence: 10,
        charisma: 10,
        savingThrowsModifier: 0,
        // vulnerabilities?: object;
        // resistances?: object;
        // immunities?: object;
        conditions: Status.Charmed,
        // createdAt?: Date;
    });

    await player.save();
    console.log('Player created:', player);
};

export default createPlayer;