## Running

`docker compose up` to run the database and seed it with development data. `docker compose down` to reset the database.

`bun run dev` to run the development server.

## App design

The app is meant for private leagues with friends, families, companies etc. Because the app cannot enforce correct results and it's meant for organic, un-administered use, everyone who has an access to a league can also record any results in there.

The front page of the application also is the dashboard. If the user has not joined any leagues, it shows an empty list and explains the basics. There are to actions they can take: create a league or join a league.

## Creating a league

When the user creates a league, they have to pass a captcha, we ask for the name of the league, the url (unique name) they'd like to have for it and a password for the league. After submitting, the league will be created and added on the front page of joined leagues. We will not redirect to the league page automatically, to demonstrate where new leagues will appear.

## Joining a league

Joining a league asks the user for the unique name of the league they'd like to join and the league's password.

## Authentication

All authentication is anonymous. The leagues they have joined are remembered on that computer and they can rejoin on different devices. They can join multiple leagues on a single device. Authentication is based on a JWT that includes the unique names of the leagues they have joined.

## League page

The league page has the following affordances.

- See current standings in a league table.
- Add, deactivate or remove (if no recorded games) a member.
- Record a new match, selecting two members and the score. Games that only have a winner but no other score, should record 1-0 for instance.
- Browse past match results for the league and for players.

## ELO ratings

I'm considering keeping the members' ELO rating directly on the server memory for instant access and easy algorithm tweaks. When the server stats, it would have to fetch all matches from the database in order to calculate the ELO ratings. This is an interesting architectural option and we could also keep track of win, draw and loss counts in the same manner. And also, the ELO changes for each player in each match are probably nice to show in the UI.

Alternatively, we store these data in database in a traditional way.
