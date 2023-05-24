import { prepareMembersData, prepareResultsData } from "./helpers.js";

// ========== Global endpoint variable til firebase========== //
const endpoint = "https://crud-1st-semester-projekt-default-rtdb.firebaseio.com/";
// const endpoint = "https://database-members-default-rtdb.firebaseio.com/";
// const endpoint = "../members";

async function getMembers() {
  const response = await fetch(`${endpoint}/members.json`);
  const data = await response.json();

  if (typeof data === "object" && data !== null) {
    console.log(data);
    const members = prepareMembersData(data);
    return members;
  } else {
    throw new Error("Invalid data format. Expected an object.");
  }
}

async function getResults() {
  const response = await fetch(`${endpoint}/results.json`);
  const data = await response.json();

  const results = prepareResultsData(data);
  return results;
}

// === GET MEMBERS BY ID === //
async function getMembersCoach(id) {
  const response = await fetch(`${endpoint}/members/${id}.json`);
  const data = await response.json();

  return data;
}

// === UPDATE Result Coach === //
async function updateSwimtimeResult(id, timeMiliSeconds, date, memberId, disciplin, tournamentName, tournament) {
  const timeToUpdate = {
    memberId: memberId,
    disciplin: disciplin,
    timeMiliSeconds: Number(timeMiliSeconds),
    date: date,
    tournamentName: tournamentName,
    tournament: Boolean(tournament),
  };
  const resultAsJson = JSON.stringify(timeToUpdate);

  const response = await fetch(`${endpoint}/results/${id}.json`, { method: "PUT", body: resultAsJson });
  return response;
}

// === DELETE (DELETE) === //
async function deleteMember(id) {
  const url = `${endpoint}/members/${id}.json`;
  const response = await fetch(url, { method: "DELETE" });
  console.log(response);
  return response;
}

// === UPDATE Member Chairman ===///
async function updateMemberChairman(id, member) {
  const memberAsJson = JSON.stringify(member);
  const url = `${endpoint}/members/${id}.json`;

  const response = await fetch(url, { method: "PUT", body: memberAsJson });
  const data = await response.json();
  return response;
}

export { getMembers, getResults, getMembersCoach, deleteMember, updateMemberChairman, updateSwimtimeResult };
