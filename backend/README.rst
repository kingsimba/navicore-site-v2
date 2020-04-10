NaviCore Site Backend API Document
==================================

Login
-----

Request
^^^^^^^

::

   POST /api/v1/auth/login

.. code-block:: jss

   {
      username: "simba",
      password: "mypassword"
   }

Response
^^^^^^^^

*  200: If username and password are correct
   
   .. code-block:: jss

      {
         status: 200,
         username: "simba"
      }

   Headers::

      Set-Cookie: navicore_site_username=simba; Max-Age=10080; Path=/; Expires=Mon, 06 Apr 2020 16:46:59 GMT
      Set-Cookie: navicore_site_token=77458675-3dda-cddc-9e84-8b77149d762d; Max-Age=10080; Path=/; Expires=Mon, 06 Apr 2020 16:46:59 GMT
      Set-Cookie: navicore_site_displayName=%E5%9B%BE%E5%90%A7; Max-Age=10080; Path=/; Expires=Mon, 06 Apr 2020 16:46:59 GMT

*  400: If username or password is empty

   .. code-block:: jss
   
      {
         status: 400,
         message: "Please provide username and password"
      }

*  401: If username or password is incorrect

   .. code-block:: jss
   
      {
         status: 401,
         message: "Invalid username/password"
      }

Logout
------

Request
^^^^^^^

::

   POST /api/v1/auth/logout

Response
^^^^^^^^

*  200

   .. code-block:: jss
   
      {
         status: 200
      }

   It will clear cookies by sending header::

      Set-Cookie: navicore_site_username=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
      Set-Cookie: navicore_site_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
      Set-Cookie: navicore_site_displayName=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT

Get Document List
-----------------

Request
^^^^^^^

::

   GET /api/v1/docs

Response
^^^^^^^^

*  200: OK

   .. code-block:: jss

      {
         status: 200,
         docs: [
            {
               title: "camera-docs",
               path: "camera"
            },
            {
               title: "NaviCore Competitive Analysis",
               path: "competitive-analysis"
            },
            {
               title: "JsonScript",
               path: "json-script"
            },
            {
               title: "Junction View",
               path: "junction-view"
            }
         ]
      }

*  401: No correct token

   .. code-block:: jss

      {
         status: 401,
         message: "Please login first"
      }

Get a Single Document
---------------------

Request
^^^^^^^

::

   GET /docs/:pathAndName
   Cookie: navicore_site_username=simba;navicore_site_token=77458675-3dda-cddc-9e84-8b77149d762d;

Response
^^^^^^^^

*  200: If succeed, return the static file under the path '/docs'. the header contains refreshed tokens if needed.
*  401: If username or token is incorrect.
*  403: If the user is not permitted to access the document.
*  404: If the file is not found.
