NaviCore Site Backend API Document
==================================

auth/login
----------

Request::

   POST /api/v1/auth/login
   
.. code-block:: jss

   {
      username: "simba",
      password: "mypassword"
   }

Response Header::

   Set-Cookie: navicore_site_username=simba; Max-Age=10080; Path=/; Expires=Mon, 06 Apr 2020 16:46:59 GMT
   Set-Cookie: navicore_site_token=77458675-3dda-cddc-9e84-8b77149d762d; Max-Age=10080; Path=/; Expires=Mon, 06 Apr 2020 16:46:59 GMT
   Set-Cookie: navicore_site_displayName=%E5%9B%BE%E5%90%A7; Max-Age=10080; Path=/; Expires=Mon, 06 Apr 2020 16:46:59 GMT

Response:

.. code-block:: jss

   {
      status: 200,
      username: simba
   }

auth/logout
-----------

Request::

   POST /api/v1/auth/logout

Response Header::

   Set-Cookie: navicore_site_username=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
   Set-Cookie: navicore_site_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
   Set-Cookie: navicore_site_displayName=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT

docs
----

Request::

   /docs/:pathAndName

Request Header::

   Cookie: navicore_site_username=simba;navicore_site_token=77458675-3dda-cddc-9e84-8b77149d762d;

Response:

* If succeed, return the static file under the path '/docs'. the header contains refreshed tokens if needed.
* If the file is not found, return 404.
* If username or token is uncorrect, return 401.
