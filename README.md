# **Brief Description**
 This system acts like a system alarm based on the availability of any vaccine slots in selected areas.
 * ## **Limitation**
    1. Once the alarm will appear, then the user has to close the alarm manually even if the slots will disappear in few seconds as well.
    2. If the user closed the alarm manually, and wishes to reinitiate during the next slot availability, then the user has to terminate this process _( Ctrl + c )_ an re-run the **Watcher** as mentioned below.
## **Requirements**
    Node.js v12
## **Install Dependencies**
    npm i
## **Start Watcher**
 * ### Change file: **./constants.mjs: "<a href="https://github.com/tanweerhossain/cowin-alarm/blob/master/constants.mjs#L3250">Mention Properly</a>"** based on
    * specific state(s)|district(s)
    * minAge
    * available_capacity_dose
    * Alarm Audio OR Video file path
    * Audio OR Video Player executable file( with absolute path, if required ) 
 * ### **To Specific States|Districts Slots**
    * **npm start**

 * #### **To Watch All States Slots**
    * **npm start -- ALL**
