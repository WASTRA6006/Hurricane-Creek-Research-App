Title
WIP
Problem + stakeholder context
The Environmental Sciences Department has a 72-acre property known as 'Hurricane Creek Research Site.' Lately, they've desired an application that can allow their researchers and volunteers to take pictures in the field and upload those pictures to their database. In later iterations, they also desired features that allow other users to see photos taken, where those photos were captured at, and filter those photos by pre-determined categories. This would provide a guided tour in a sense to anyone within the area of the site.
V1 scope (what it does)
The first version of the project mainly serves as a connection between user and admin. The user utilizes the software in the field to take pictures and submit the pictures to the ELC database with geographic information attached. The user also is able to include notes, categories, and other optional selections onto the images to make viewing an easier process.
Stretch features (your 3 picks)
1. DB-level pagination/filter/search
Increases efficiency by not returning everything inside of the database. Additionally, filter and search further reduce the load of what is returned by the database at a time. Overall this would allow a more efficient and fast-loading system for both admin and user bases.
2. Audit log table
Encourages responsible use of the application due to knowledge of which user posted something being known to admins. It also provides a concrete history/log of actions so that there is a trail to follow later on if necessary. Aside from the safety, trust, and accountability aspects: it also aids in debugging since it can provide records of who did what at any given time.
3. Offline queue (PWA local → upload when online)
Users will be taking pictures within the research site. Some areas in the research site may fail to have service. In this case, users should still be able to continue their actions and have their images and data uploaded at a later period when service returns.
Tech stack
Front-End: Next JS
Back-End: Express JS and Node
Database: Postgres
Implementation plan (phases)
Phase 1: Information gathering, stakeholder constraints, and scope locking
I gather stakeholder constraints and information regarding the already existing technology being utilized in their operations. I meet with them to discuss scope and direction for the project. I lock that scope in and create a plan for achieving my project.
Phase 2: MVP production
I create a working product with the minimal requirements completed. This would be a PWA that allows both user and admin login. Users would be able to take pictures within the field and upload these images to the database. Admins would be able to view the images and attached meta-data within the database.
Phase 3: Feature expansion and polish
I expand upon already existing features and add new ones. I add the aforementioned 'strech features' alongside features that I feel would make the product more intuitive or efficient.
Phase 4: Documentation and Demo Practice
I begin writing my report for the project utilizing my documentation that I had kept throughout. I also ensure that my product is fully ready for the demo during finals week. Any reports I recieve from in-field testing of my product and stakeholder feedback will also be utilized in the final report.
Expected outcome
A product that allows users to operate within the Hurricane Research Site to take photos and submit to the ELC database, with precautions regarding the possibility of service outages being addressed. The admins within the ELC should be able to view these photos and utilize them in their research and everyday operations within the site while being able to utilize features such as search and filter functions. Overall, the product should be efficient and intuitive for all users in order to provide a seamless and engaging experience.

