const endpoint = "https://crud-1st-semester-projekt-default-rtdb.firebaseio.com/";

// ========== Laver objekt til array ========== //
function prepareMembersData(data) {
  const members = [];
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const member = data[key];
      member.id = key; // Assign the numeric key as the `id` property
      members.push(member);
    }
  }
  return members;
}

function prepareResultsData(dataObject) {
  const resultsArray = [];

  for (const key in dataObject) {
    const result = dataObject[key];
    result.id = key;
    resultsArray.push(result);
  }
  return resultsArray;
}

async function createMember(
  firstname,
  lastname,
  age,
  phone,
  email,
  active,
  activityForm,
  disciplines,
  coach,
  subscriptionStart,
  member
) {
  const newMember = {
    firstname,
    lastname,
    age,
    phone,
    email,
    active,
    activityForm,
    disciplines,
    coach,
    subscriptionStart,
    member,
  };
  const newMemberJson = JSON.stringify(newMember);
  const response = await fetch(`${endpoint}/members.json`, {
    method: "POST",
    body: newMemberJson,
  });
  return response;
}

async function createNewTime(date, disciplin, memberId, timeMiliSeconds, tournament, tournamentName) {
  const newTime = {
    date,
    disciplin,
    memberId,
    timeMiliSeconds,
    tournament,
    tournamentName,
  };
  const newTimeJson = JSON.stringify(newTime);
  const response = await fetch(`${endpoint}/results.json`, {
    method: "POST",
    body: newTimeJson,
  });
  return response;
}

export { prepareMembersData, prepareResultsData, createMember, createNewTime };
