# Kyle Bentle — Case Study Content

---

## Gallopade: Redesigning the Most Critical Teacher Workflows

**Role:** Lead Designer, working alongside and mentoring an associate designer
**Status:** Released, both flows currently in production
**Client:** Gallopade, a K–8 social studies courseware platform serving school districts across the US

### The Problem

Teachers who use Gallopade didn't choose it, their district did. When a mandated product arrives on top of an already maxed out workload, there's little grace period. A confusing first hour becomes a complaint to the district, and enough complaints mean a lost renewal.

Two workflows were carrying most of that risk. Course setup was technically complex and high-stakes: A wrong turn meant grades didn't sync, rosters didn't load, and teachers stopped using the product. Grading had accumulated enough steps that teachers were opting out of manually-graded questions entirely.

### The Solution

These aren't stylish designs, but they shouldn't be. This is a high-stakes process that should be as easy and fast as possible for busy teachers.

For course setup, we created a centralized starting point: A guided, structured workflow that replaced a complex, open-ended process with clear steps and appropriate guardrails. The design makes the right path easy to follow and hard to accidentally leave.

For this process I worked closely with the client's engineering team, to fully understand the constraints we were working under. In the end, we were able to eliminate many of the decisions the user needed to make, prefilling options and only showing data relevant to them.

For grading, we stripped away friction. The redesigned workflow significantly reduced the steps required to grade a student assessment. Teachers could be grading hundreds of students in an assignment, with thousands of total questions they need to get through. Every click adds up.

These designs also show an AI grading feature which came out later, another improvement that I worked on to help teachers grade faster.

### The Impact

The results of the project showed up in support numbers. Searches that had clustered around basic questions like "can't find course" gave way to more specific questions like "hide courses" and "how to release grades." That shows that users cleared the initial hurdle and are now trying to do more with the product.

- **75%** drop in views for help articles directly related to course setup
- **42%** reduction in overall per-capita help searches

### The Process

**The product teachers didn't choose**

This was Gallopade's first engagement with an external UX team. So far their process had been largely engineering-led, and part of our job was demonstrating what a structured UX process looks like and why it produces different outcomes.

We started with the people closest to users: Customer experience reps and sales associates who field teacher questions every day. These conversations helped us understand the real pain points, what teachers were actually calling about. From there, we moved through multiple rounds of design with weekly client check-ins, validated with real users through moderated testing on Figma prototypes, and worked directly with engineering through implementation.

**Keeping engineering in the room**

Engineers were in every meeting from the start. Keeping engineering in the room meant we were designing toward reality throughout, and the engineers were able to share their own ideas.

**Timing as a design decision**

We recommended a summer release, and the client agreed. Releasing during the off-season gave teachers time to encounter the new flows before the pressure of an active school year, gave the training team time to prepare, and let the new version become the version teachers encountered first rather than a disruptive change arriving mid-semester.

**Leading the engagement**

I led the project alongside an associate designer. We divided the two flows between us, with me overseeing the overarching work and helping them develop client relationship skills.

### Reflection

The biggest challenge for this project was building a partnership with a team that had never worked with UX before. Gallopade's team was experienced and invested, but their frame of reference was shaped by years of engineering-led development. Early on, we went through several rounds of iteration on how we were delivering designs, finding the right level of annotation and the right format for handoff, before landing on something that worked well for everyone.

If I were doing it again, I'd invest even more time upfront, discussing how we were going to work together and hand off designs, rather than assuming our process would translate naturally.

I'd also advocate earlier for more structured post-release measurement. The help search data was useful, but it was the best available option rather than a purpose-built feedback mechanism. Building even a lightweight analytics monitoring plan into the project from the start would have produced better signals after release.

---

## GoNoodle: UX Triage

**Role:** Lead designer
**Status:** Released into the product
**Client:** GoNoodle, a movement and mindfulness video platform used in 90% of US public elementary schools

### The Problem

GoNoodle gives teachers a way to build short movement and transition breaks into the school day, the kind of tool that becomes part of a classroom's rhythm.

In 2023, GoNoodle released a redesign of the platform. Users were angry. Sentiment turned negative, and the number of teachers regularly using the product dropped significantly. My team was brought in as an external UX partner with a clear mission: Figure out what went wrong, reduce the fallout, and fix it.

This project was also time-sensitive. We had about four weeks to validate the problem, address it with new designs and re-test.

### The Solution

The first instinct in a situation like this is to redesign again. Something isn't working, so you rebuild it. But one of the most important things we established early on was that this instinct was wrong.

Teachers had just experienced a major change to a product they used in front of their students every day. It landed right before back-to-school season, one of the highest-pressure moments in a teacher's year, when there's no room for a familiar tool to suddenly work differently. The anger wasn't about the look of the product, but the disruption: Routines broken, muscle memory no longer right, all at the worst time.

Introducing another round of sweeping changes would have worsened the problem, not solved it. We focused the design work on something that came up in our initial research again and again: Teachers couldn't find their students' favorite videos.

The solution needed to be targeted and restrained. We made focused changes in three areas of the product. On the homepage, we surfaced favorited videos, added a recently watched list, and introduced personalized recommendations tailored to each teacher's class. On channel pages, we added structure, hierarchy, and filtering so teachers could quickly narrow down to what was relevant. And we gave the class mascot more prominence at the moment points are awarded, restoring a moment of delight that the redesign had removed.

### The Impact

As a one-time consulting engagement, I didn't have access to post-release data. The designs continued shipping into the product after we wrapped.

### The Process

**Understanding the real source of frustration**

We started by analyzing responses from a GoNoodle survey, looking for themes that could focus the project. What surfaced early was consistent. Teachers had too many clicks to get to the videos they used regularly, and they were running into that friction in real time, in class in front of their students.

From there, I conducted focused interviews with current users. The goal was to understand how teachers actually use GoNoodle in the classroom and what had changed since the redesign.

What emerged from the interviews wasn't a single clear culprit. The dissatisfaction came from an accumulation of smaller pain points. The way users found videos had changed. Established routines had been disrupted. And most importantly, teachers hadn't known the change was coming until they were already in the classroom, students watching, trying to pull up a familiar video that no longer behaved the way they expected. Teachers had set routines, and the redesign broke those routines without warning.

**Validating at scale before going deep**

To pressure-test the findings, we sent a survey to 700+ GoNoodle users. We also developed a set of low-fidelity design concepts addressing the pain points we'd identified and included them in the survey to gauge whether they moved the needle on satisfaction. We wanted to test ideas quickly before going high-fidelity rather than rushing in blind.

The results focused our path forward. The overall top contributing factor to dissatisfaction was the ability to quickly find and play video. Despite a large library of videos, teachers tend to pick videos they've seen before and know their students like. The content they relied on most wasn't where they expected it to be.

The survey also confirmed what not to focus on. Most teachers were satisfied with GoNoodle's visual design, which ruled out aesthetics as a meaningful factor in the loss of users.

**Low-fidelity design: Moving fast with a clear constraint**

With a focused problem to solve, we moved into low-fidelity wireframes. The central question was straightforward. How do we get the right video in front of the right teacher, as fast as possible?

We explored three directions. The first added structure and hierarchy to individual channel pages, with filtering by duration, activity type, energy level, grade level, and character. The second introduced a personalized "My Class" homepage with a recently watched list, favorites shelf, and class-specific recommendations. The third was a guided "Pick For Me" flow that let teachers receive curated video suggestions.

Low-fidelity designs let us move quickly, share progress frequently with the client team, and stress-test ideas before committing to higher-fidelity work.

**High-fidelity and validation**

After client feedback on the low-fi work, we moved into high fidelity. The design direction centered on surfacing the right content faster, without altering the fundamental way teachers navigate the product.

We validated the designs across user focus groups. Teachers responded strongly to seeing familiar videos surfaced prominently and the personalized recommendations shelf landed well. Teachers also told us that seeing popular videos from peers would help them discover content they were missing. And seeing the class mascot on the homepage made the experience feel personal in a way that resonated both for teachers and students.

One finding pushed back on a "Pick For Me" feature. Participants liked it but ranked it as lower priority than the homepage, history, and channel page improvements. We recommended holding it for a later release.

We wrapped the project with a full set of UX recommendations and validated designs.

### Reflection

The most challenging part of this project wasn't the actual design work — it was operating with a client organization that was under major stress. That pressure shaped every conversation, and we had to focus on keeping the process grounded and the work steady.

On a project like this, the instinct to blow up designs is real. The research gave us the discipline to act deliberately instead. Making that case to a client who was anxious to act felt like the right kind of guidance for an external UX team.

If I could change one thing, I'd build a dedicated monitoring plan into the engagement from the start. Without that post-release data, my story ends at delivery.

---

## Reporting & Dashboards in Achieve

**Role:** Primary Designer for Reporting and Dashboards on Achieve, over 5 years
**Client:** Macmillan Learning, a leading educational technology and publishing company that develops digital learning platforms and course materials for higher education and high school. Their primary product is Achieve, a courseware solution that includes assignments, eBooks, and other instruction materials.

### Overview

Reporting in an educational platform is about helping instructors make better decisions, faster. Across more than five years as Achieve's primary reporting designer, I tackled that challenge through projects that include a comprehensive student gradebook, a redesigned assessment view, and lightweight in-context alerts. Together, they tell the story of a reporting system built for real instructor workflows.

---

### Project 1: Individual Student Gradebook

*Creating the focal point for a scaling system of reports*

**The Problem**

Achieve is a complex platform, and for instructors the data they need most was buried. To get a clear picture of how one student is performing required pulling information from multiple areas of the product, with no single place to bring it all together. For an instructor asking a simple question like "Should I give this student an extension?" or "Is this student's grade trending up or down?" getting an answer took time that instructors didn't have.

**The Solution**

For this project, the team jumped immediately into design, feeling like we had a good understanding of the problem without the need for upfront discovery research. We also felt that the true test for the designs would be when it's in use with actual teachers in actual situations, rather than a Figma prototype with no real-world pressures.

The design was collaborative, with continuous feedback with internal stakeholders and other designers. The team shipped an MVP, then iterated after reviewing product analytics. Updates included a refined header, more data visualization, data exports, and the in-context side panel.

During the process we made several pivots on what data to show the user at what time. For example, in some post-MVP designs we included a separate tab that showed detailed engagement data for the student: When they were logging in, what they were accessing, and how long they spent in the system. For this we ran pre-release user testing, and determined that the feature was initially well-liked, but users struggled to explain how or when they would use it. Instead of taking the time and expense of developing it fully, we pivoted to a lower-cost export feature that we felt would still satisfy the use case.

**The Impact**

- **Strong retention:** Instructors keep coming back to the page, a stickiness pattern not seen in other reporting features, which often see dropoff as the course goes on.
- **PURE score:** Scored highly in an independent PURE usability analysis.
- **Strong perceived value:** At release, a large majority of surveyed users said the feature increased the value of the entire product.

---

### Project 2: Assessment Responses

*Complex data, at a glance*

**The Problem**

Achieve's data from student assessments is rich, but hard to use. The previously existing dashboard surfaced a lot of different data points at once, with no easy way to scan for what mattered. Instructors couldn't quickly answer two of their most important questions: Which questions are tripping students up, and which students are struggling?

**The Solution**

The core challenge was that instructors needed multiple levels of context from the same data. At any given moment, a user might want to see how the whole class performed on a specific question, then shift to how a specific student performed across all questions, then compare time spent across both dimensions. The existing view tried to support all of this through a series of individual charts, each providing one slice of the picture. But moving between them required switching context and scanning separate charts. It added cognitive load instead of helping.

The guiding principle to the design process became one lens at a time, with the ability to go deeper when needed. Multiple rounds of sketching and critique with the full design team generated a range of approaches. Ongoing reviews with stakeholders across product, engineering, and customer experience helped ensure the final interface held up under scrutiny.

The final designs were prototyped using real student data, which made testing more grounded and the results easier to evaluate. Moderated and unmoderated testing sessions showed users responding positively across the board and calling it a clear improvement over the existing dashboard.

**The Impact**

- **User validation:** Moderated and unmoderated testing validated the approach. Users called it a clear improvement over the existing view.
- **Status:** Designs are complete, awaiting development.

---

### Project 3: Student Alerts

*In-context data insights*

**The Problem**

A reporting dashboard is only valuable if instructors use it. For busy instructors, finding time to seek out data, interpret it, and decide what to do with it is a huge barrier. Those who most needed the information were the least likely to see it.

**The Solution**

Rather than building another destination for instructors to navigate to, we needed to show the right data where instructors already are. These are smaller, targeted interventions at the moment they are most actionable.

When designing for data, I try to know what questions the user is asking themselves at each point in the journey. Here we are putting high-stakes answers to those questions (How many of my students haven't logged in this week?) in the area of the product that instructors are spending the most time in. Another example is student-facing (Which of my assignments are due this week?).

**The Impact**

- **Inactive student alert:** During the current beta, 75% of users surveyed said the alert helped them better understand their students' activity in the course.
- **Student-facing grade view:** 85% of students surveyed after launch said the progress bar helped them better understand what work they've done and what's due.

---

### Reflection

Five years of building reporting features for Achieve (as well as 10 years in data journalism) taught me a lesson that runs counter to most instincts: More data is not always better.

The instructors using Achieve are rarely sitting down to leisurely explore a dashboard. They have five minutes before the next class, a student at their door, and a full email inbox to get through. A robust dashboard is only useful if there's time and attention to use it.

The clearest proof of this came from the simplest thing we built: The inactive student alert on the course homepage. A single signal, surfaced where instructors were already spending time, pointing to a clear action. No navigation required, no report to interpret. That simple feature currently has the highest engagement of any insights project across Achieve.

---

## Guided Reading: Designing an AI-Powered Activity Students Actually Want to Use

**Role:** Sole UX Designer
**Status:** Beta, full release coming Fall 2026
**Client:** Macmillan Learning, a leading educational technology and publishing company that develops digital learning platforms and course materials for higher education and high school

### The Problem

Instructors face a classic problem: It's hard to get students to actually do the reading, and harder still to know whether they understood it. Traditional eBook applications check completion, not comprehension.

### The Solution

Guided Reading was built on a different premise. What if the assignment itself could meet students where they are, adapt to what they know, and make them genuinely engage with the material? How might we make the assignment feel less like a box to check and more like a conversation?

Guided Reading is an AI-powered reading activity integrated into Macmillan Learning's Achieve platform. Students are assigned a session tied to specific course content. Rather than passively reading and answering multiple-choice questions, students engage in an adaptive dialogue with an AI that asks questions, responds to their answers, and adjusts in real time.

For instructors, Guided Reading fits into existing workflows without adding unnecessary work. Assignments are created directly inside Achieve and deployed to Canvas, Blackboard, or any LMS the school already uses. When a student completes an activity, performance data flows automatically into the gradebook, without separate systems to manage.

### The Impact

A pilot program for students began with a rough prototype, but after a UX overhaul was implemented the data told a clear story. Students were completing more waypoints, understanding more of the reading material, and reporting a better overall experience.

- **90%** student activity completion rate, up from 50% before UX investment
- **+78** student NPS score
- **36%** of instructors indicated likelihood to switch from their current product for access to Guided Reading
- **88%** of students reported feeling more confident in their understanding of the material

### The Process

**Where it started**

In early 2025, the product team at Macmillan Learning developed an initial concept for Guided Reading and ran a proof of concept with instructors. The signal was promising but the user experience was rough. The vibe-coded prototype was built to see if the idea was technically possible, rather than serve a user.

When I came on board, the team was excited and eager to move fast. I wanted to maintain the momentum, while also making sure we were building with user-centered principles. I first ran a series of workshops with other UX designers, sketching in different directions before committing to any of them. From there, I moved into lo-fi designs, got all the stakeholders on the same page, and handed off early wireframes for engineering to begin prototyping.

**Moving fast on purpose**

The lo-fi prototype was built with a specific goal: Don't get precious about the UI, just test if the core idea works. Can the AI perform well enough to actually help students? Does the fundamental activity framework make sense? And most importantly, would students actually engage with this thing?

We tested with students and instructors, and the results were promising. One piece of data stood out: In a survey of instructors, 36% said they would be likely or very likely to switch from their existing product to a comparable one that included Guided Reading activities. In EdTech the barrier to switching is high, and that kind of number was a strong signal.

**Where UX made the difference**

We moved into mid-fidelity, where I started working through the finer details. Better feedback states, clearer progress signals, and refining the mobile view. We know students are likely to be doing these assignments on their phones, so we wanted to make sure that experience was easy.

At this time I also gave input into the text responses the AI was returning — length, tone, and how it framed feedback to students.

The testing results after these updates were encouraging. Before the UX overhaul, 50% of students completed an activity. After the redesign was implemented: 90%. And students were enjoying activities more. Guided Reading earned a student NPS score of +78, well above the threshold most researchers consider "excellent."

**Designing for a real product ecosystem**

In Q4 2025, the decision was made to fully implement Guided Reading into Achieve, Macmillan's primary courseware product. Achieve is a complex product, and sits in the middle of an ecosystem of other products that instructors deal with every day.

To address this ecosystem I had to think beyond the assignment itself. How does an instructor assign a Guided Reading? What options should they have, and how does assigning it fit into their existing workflow? How does student performance feed into the gradebook they already use? How does this assignment get deployed to a learning management system?

Instructors are busy and have set routines. A beautiful product that doesn't fit into those routines is a product that doesn't get used. I worked through each of these points carefully, designing for instructors and admins alongside students, and delivering final design specs to engineering.

### Reflection

The biggest challenge on this project was balancing speed and quality. There was pressure in the beginning to run with some assumptions about how the user experience should work, made before I joined the project. Slowing down to run workshops and rebuild on better foundations sometimes felt like I was adding friction and pushing back. In the end, it was the right call. The final work went faster because the foundations were clearer.

What comes next: Guided Reading exits beta this fall, and I'm starting to think about what the post-release updates could be. I'd love to explore voice interaction, where the dialogue happens out loud in a Socratic fashion. There's also opportunity to add more moments of delight inside the experience, the small, satisfying feedback that makes a student feel like they're making meaningful progress.

---

## Formative Journalism Experience

*Ten years as a data visualization journalist. Florida Times-Union → Chicago Tribune → UX.*

### Intro

I came to UX later, spending a decade working as a journalist. During that time I wore a lot of hats: Graphic artist, data analyst, data visualizer, reporter, copyeditor. All under the constant deadline pressure that comes with a 24/7 news cycle. That background still shapes how I approach design work.

### The Career

**From the newsroom to the screen**

I graduated from Ball State University with a degree in journalism graphics, a program that spanned both journalism and graphic design. So along with the reporting and writing classes, I also had color theory, typography, and early web design.

My first job out of college was as a graphic artist at the Florida Times-Union in Jacksonville. I was making maps and charts, doing magazine cover illustrations, art directing photo shoots, and producing some interactives in Flash.

From there I moved to Chicago to join the Chicago Tribune as a data visualization journalist. The work got more specialized and more technical. This is where I leaned into code, teaching myself front end design, how to do deeper data analysis using tools like GIS systems, and building complex interactive visualizations using JavaScript libraries like D3.

The work I was doing at the Tribune was all about how a reader would interpret and possibly act on the information I was showing them. Once I decided it was time to exit the journalism industry, I realized I had been practicing a form of user experience design the entire time.

### Skills

**The instincts that carried over**

**The raw numbers aren't the story.** In data visualization journalism, the numbers are raw material, not the deliverable. I spent years working with election results, crime statistics, economic data, and public health numbers, and the job wasn't to show all of it. It was to find the one thing the reader needed to understand, show it and get out of the way. That discipline runs directly into data-heavy UX work. The question is never "What data can we show?" It's "What is the key thing this person need to know right now?"

**Storytelling matters.** Every story I wrote or graphic I produced was an argument for why someone should care about something. That's the same as presenting design to a skeptical stakeholder. You're not describing what you did, you're making the case for why it's right and why they should care.

**A decade of hard deadlines.** A 24/7 newsroom measures time in minutes, not sprints. I did that for ten years. What it instilled wasn't a tolerance for cutting corners, it was the ability to move fast without losing the quality. Under pressure, I don't freeze, I don't spiral. I work.

**Lead with what matters.** In journalism, you put the most important thing first because you can't assume you'll have the reader's attention for long. That instinct runs through my design work. When I'm approaching a problem, I'm always asking, what is the single most important thing the user needs to accomplish right now, before I lose them?

**Skeptical of the brief.** Journalists don't build stories on press releases. The release tells you what someone wants you to say, the story comes from what you find when you push past it. In product design, that reflex applies to requirements. Those describe a solution someone has already decided on. The more interesting question is usually a level up. What problem are we actually trying to solve, and is this the right answer to it?
