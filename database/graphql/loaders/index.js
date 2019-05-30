const knex = require('../../knex');

const loadPlayerTeams = (playerIds) => {
  return knex
    .select({ player_id: 'players.id' }, 'teams.*')
    .from('players')
    .join('teams', 'players.team_id', 'teams.id')
    .whereIn('players.id', playerIds)
    .then((rows) =>
      playerIds
        .map((id) => rows.find((player) => player.player_id === id))
        .map((team) => {
          if (team) {
            return { id: team.id, name: team.name };
          }
          return null;
        }),
    );
};

const loadTeamPlayers = (teamIds) => {
  return knex
    .table('players')
    .whereIn('team_id', teamIds)
    .select()
    .then((rows) => teamIds.map((id) => rows.filter((player) => player.team_id === id)));
};

const loadMatchWinnerTeams = (matchIds) => {
  return knex
    .select({ match_id: 'matches.id' }, 'teams.*')
    .from('matches')
    .join('teams', 'matches.winner_team_id', 'teams.id')
    .whereIn('matches.id', matchIds)
    .then((rows) =>
      matchIds
        .map((id) => rows.find((match) => match.match_id === id))
        .map((team) => {
          if (team) {
            return { id: team.id, name: team.name };
          }
          return null;
        }),
    );
};

const loadMatchLoserTeams = (matchIds) => {
  return knex
    .select({ match_id: 'matches.id' }, 'teams.*')
    .from('matches')
    .join('teams', 'matches.loser_team_id', 'teams.id')
    .whereIn('matches.id', matchIds)
    .then((rows) =>
      matchIds
        .map((id) => rows.find((match) => match.match_id === id))
        .map((team) => {
          if (team) {
            return { id: team.id, name: team.name };
          }
          return null;
        }),
    );
};

module.exports = {
  loadPlayerTeams,
  loadTeamPlayers,
  loadMatchWinnerTeams,
  loadMatchLoserTeams,
};
