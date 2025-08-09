## Description and Requirements

This is the client-side code for the Brevly URL shortener service. 

### Tech Stack

- TypeScript
- React
- Vite without framework
- Tailwind CSS
- React Query
- Zod

### Functionality and rules

* [] Should be able to create a link
  * [] Should not be able to create a link with a short URL that is not a valid URL
  * [] Should not be able to create a link with a short URL that already exists
* [] Should be able to delete a link
* [] Should be able to get the original URL from a short URL
* [] Should be able to list all registered URLs
* [] Should be able to increment the click count for a short URL
* [] Should be able to download a CSV file with the report of created links

### Technical requirements
* It's required to be a single page application with React using Vite as the bundler
* Use elements that create a good experience to the user (empty state, loading icons, action blocking depending on application state)
* Application should be responsive providing a good experience on Desktop and Mobile devices
* Use Tailwind CSS for styling
* Use React Query for data fetching
* Use Zod and React Hook Form for form validation

### Pages
The application has 3 pages:
* The root page (`/`) should have a form to create a new link and a list of all created links
* The `/:short_url` page should have the original URL
* The not found page (`/404`) should have a message indicating that the page was not found. This page should be displayed for any page that don't follow the pattern above or the short_url doesn't exist.

### Environment variables

````
VITE_FRONTEND_URL=
VITE_BACKEND_URL=
````

