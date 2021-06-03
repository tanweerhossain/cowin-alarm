# **Brief Description**
 This system acts like a system alarm based on the availability of any vaccine slots in selected areas.
 * ## **Limitation**
    1. Once the alarm will appear, then the user has to close the alarm manally even if the slots will disappear in few seconds as well.
    2. If the user closed the alarm manually, and wishes to reinitiate during the next slot availability, then the user has to terminate this process _( Ctrl + c )_ an re-run the **Watcher** as mentioned below.
## **Requirements**
    Node.js v12
## **Install Dependencies**
    npm i
## **Start Watcher**
 * ### Change fin file: **./constants.mjs: "Mention Properly"** based on
    * specific state(s)|district(s)
    * minAge
    * available_capacity_dose
    * Alarm Audio OR Video file path
    * Audio OR Video Player executable file( with absolute path, if required ) 
 * ### **To Specific States|Districts Slots**
    * **npm start**

 * #### **To Watch All Country Slots**
    * **npm start -- ALL**