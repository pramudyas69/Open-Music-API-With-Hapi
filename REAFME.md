# OpenMusic API

API that store free-music playlist to everybody.

## Data

This API will store data that has attributes like the following:

### Album

The album has the following attributes:

```json
{
  "id": "string",
  "name": "string",
  "year": "number"
}
```

This is an example of the album:

```json
{
  "id": "album-Mk8AnmCp210PwT6B",
  "name": "Viva la Vida",
  "year": 2008
}
```

### Song

The song has the following attributes:

```json
{
  "id": "string",
  "title": "string",
  "year": "number",
  "genre": "string",
  "performer": "string",
  "duration": "number",
  "albumId": "string"
}
```

This is an example of the song:

```json
{
  "id": "song-Qbax5Oy7L8WKf74l",
  "title": "Life in Technicolor",
  "year": 2008,
  "performer": "Coldplay",
  "genre": "Indie",
  "duration": 120,
  "albumId": "album-Mk8AnmCp210PwT6B"
}
```

## API Endpoint

### Album

#### 1. Add an album

Use this endpoint to add a new album.

```raml
/albums:
  post:
    description: Add a new album.
    request:
      body:
        application/json:
          example: |
            {
              "name": "Viva la Vida",
              "year": 2008
            }
    responses:
      201:
        body:
          application/json:
            example: |
              {
                "status": "success",
                "data": {
                  "albumId": "album-Mk8AnmCp210PwT6B"
                }
              }
      400:
        body:
          application/json:
            example: |
              {
                "status": "fail",
                "message": "<invalid validation message>"
              }
      500:
        body:
          application/json:
            example: |
              {
                "status": "error",
                "message": "Something went wrong in our server."
              }
```

#### 2. Get an album

Use this endpoint to get an album.

```raml
/albums/{albumId}:
  get:
    description: Get an album.
    responses:
      200:
        body:
          application/json:
            example: |
              {
                "status": "success",
                "data": {
                  "album": {
                    "id": "album-Mk8AnmCp210PwT6B",
                    "name": "Viva la Vida",
                    "year": 2008,
                    "songs": [
                      {
                        "id": "song-Qbax5Oy7L8WKf74l",
                        "title": "Life in Technicolor",
                        "year": 2008,
                        "performer": "Coldplay",
                        "genre": "Indie",
                        "duration": 120,
                        "albumId": "album-Mk8AnmCp210PwT6B"
                      }
                    ]
                  }
                }
              }
      404:
        body:
          application/json:
            example: |
              {
                "status": "fail",
                "message": "Album not found."
              }
      500:
        body:
          application/json:
            example: |
              {
                "status": "error",
                "message": "Something went wrong in our server."
              }
```

> If there are **no songs** in the album, the `songs` property will be not exist in the response body (`undefined`).

#### 3. Edit an album

Use this endpoint to edit an album.

```raml
/albums/{albumId}:
  put:
    description: Edit an album.
    request:
      body:
        application/json:
          example: |
            {
              "name": "Viva la Vida",
              "year": 2008
            }
    responses:
      200:
        body:
          application/json:
            example: |
              {
                "status": "success",
                "message": "Album successfully updated."
              }
      400:
        body:
          application/json:
            example: |
              {
                "status": "fail",
                "message": "<invalid validation message>"
              }
      404:
        body:
          application/json:
            example: |
              {
                "status": "fail",
                "message": "Album not found."
              }
      500:
        body:
          application/json:
            example: |
              {
                "status": "error",
                "message": "Something went wrong in our server."
              }
```

#### 4. Delete an album

Use this endpoint to delete an album.

```raml
/albums/{albumId}:
  delete:
    description: Delete an album.
    responses:
      200:
        body:
          application/json:
            example: |
              {
                "status": "success",
                "message": "Album successfully deleted."
              }
      404:
        body:
          application/json:
            example: |
              {
                "status": "fail",
                "message": "Album not found."
              }
      500:
        body:
          application/json:
            example: |
              {
                "status": "error",
                "message": "Something went wrong in our server."
              }
```

### Song

#### 1. Add a song

Use this endpoint to add a new song.

```raml
/songs:
  post:
    description: Add a new song.
    request:
      body:
        application/json:
          example: |
            {
              "title": "Life in Technicolor",
              "year": 2008,
              "genre": "Indie",
              "performer": "Coldplay",
              "duration": 120,
              "albumId": "album-Mk8AnmCp210PwT6B"
            }
    responses:
      201:
        body:
          application/json:
            example: |
              {
                "status": "success",
                "data": {
                  "songId": "song-Qbax5Oy7L8WKf74l"
                }
              }
      400:
        body:
          application/json:
            example: |
              {
                "status": "fail",
                "message": "<invalid validation message>"
              }
      500:
        body:
          application/json:
            example: |
              {
                "status": "error",
                "message": "Something went wrong in our server."
              }
```

#### 2. Get songs

Use this endpoint to get songs, and optionally filter them by `title` and `performer`.

```raml
/songs:
  get:
    description: Get all songs.
    queryParameters:
      - name: title
        type: string
        description: Title of the song.
        required: false
      - name: performer
        type: string
        description: Performer of the song.
        required: false
    responses:
      200:
        body:
          application/json:
            example: |
              {
                "status": "success",
                "data": {
                  "songs": [
                    {
                      "id": "song-Qbax5Oy7L8WKf74l",
                      "title": "Life in Technicolor",
                      "performer": "Coldplay",
                    }
                  ]
                }
              }
      500:
        body:
          application/json:
            example: |
              {
                "status": "error",
                "message": "Something went wrong in our server."
              }
```

#### 3. Get a song

Use this endpoint to get a song.

```raml
/songs/{songId}:
  get:
    description: Get a song.
    responses:
      200:
        body:
          application/json:
            example: |
              {
                "status": "success",
                "data": {
                  "song": {
                    "id": "song-Qbax5Oy7L8WKf74l",
                    "title": "Life in Technicolor",
                    "year": 2008,
                    "genre": "Indie",
                    "performer": "Coldplay",
                    "duration": 120,
                    "albumId": "album-Mk8AnmCp210PwT6B"
                  }
                }
              }
      404:
        body:
          application/json:
            example: |
              {
                "status": "fail",
                "message": "Song not found."
              }
      500:
        body:
          application/json:
            example: |
              {
                "status": "error",
                "message": "Something went wrong in our server."
              }
```

#### 4. Edit a song

Use this endpoint to edit a song.

```raml
/songs/{songId}:
  put:
    description: Edit a song.
    request:
      body:
        application/json:
          example: |
            {
              "title": "Life in Technicolor",
              "year": 2008,
              "genre": "Indie",
              "performer": "Coldplay",
              "duration": 120,
              "albumId": "album-Mk8AnmCp210PwT6B"
            }
    responses:
      200:
        body:
          application/json:
            example: |
              {
                "status": "success",
                "message": "Song successfully updated."
              }
      400:
        body:
          application/json:
            example: |
              {
                "status": "fail",
                "message": "<invalid validation message>"
              }
      404:
        body:
          application/json:
            example: |
              {
                "status": "fail",
                "message": "Song not found."
              }
      500:
        body:
          application/json:
            example: |
              {
                "status": "error",
                "message": "Something went wrong in our server."
              }
```

#### 5. Delete a song

Use this endpoint to delete a song.

```raml
/songs/{songId}:
  delete:
    description: Delete a song.
    responses:
      200:
        body:
          application/json:
            example: |
              {
                "status": "success",
                "message": "Song successfully deleted."
              }
      404:
        body:
          application/json:
            example: |
              {
                "status": "fail",
                "message": "Song not found."
              }
      500:
        body:
          application/json:
            example: |
              {
                "status": "error",
                "message": "Something went wrong in our server."
              }
```