import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Set up state variables using useState
  const [students, setStudents] = useState([]);
  const [searchByNameInput, setSearchByNameInput] = useState('');
  const [searchByTagInput, setSearchByTagInput] = useState('');

  // Function that runs when page is loaded, using UseEffect, similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Async function to fetch student data
    async function getStudents() {
      // read our JSON
      let response = await fetch('https://api.hatchways.io/assessment/students');
      let user = await response.json();
      // console.log(user.students);
      // save students in state
      setStudents(user.students);
    }
    // Calls the above function once on page load
    getStudents();
  }, []);

  // Function to add a new tag to a student, taking in a reference to the event that called it, and the student who we should add the tag to
  function addTag(event, student) {
    // prevent the form from submitting and reloading page
    event.preventDefault();

    // make a shallow copy of all the existing students, since you shouldnt directly modify an array in state
    let currentStudents = [...students];

    //iterate through each student 
    currentStudents.forEach((stud, index, array) => {
      //find the student whose id is the same as the student.id passed in as input
      if (stud.id === student.id) {
        //if this is the first time this student has a tag, i.e. they don't yet have a 'tags' property (array)
        if (!stud.hasOwnProperty('tags'))
          //add new 'tags' property, which is a new array containing the tag sent as form input
          currentStudents[index].tags = [event.target.tag.value];
        //else if student already has a tag property/array, simply push the new tag into array
        else currentStudents[index].tags.push(event.target.tag.value);
      }
    });

    //update existing state with the modified array
    setStudents(currentStudents);
    //clear the form input
    event.target.tag.value = '';
  }

  // Function that creates JSX to display a student's tags 
  function displayTags(student) {
    // If the student has tags...
    if (student.hasOwnProperty('tags')) {
      // iterate through the tags array, create a div for each tag and return that result
      return student.tags.map((tag, index) => {
        return <div key={tag + index} className='font-raleway mt-2 mr-1 cursor-default rounded-md bg-gray-300 px-2 py-1 text-sm'>{tag}</div>
      });
    }
  }

  // Function that opens/closes the grades panel, and toggles the +/- icon, takes the ids of the student's grades panel
  function toggleGrades(id1, id2) {
    //select the grades panel div whose id = the id1 passed in
    const gradesElement = document.querySelector(`#${id1}`);
    //toggle the "js-hide" CSS class (as saved in App.css) which hides/displays the grades panel
    gradesElement.classList.toggle('js-hide');

    //select the +/- icon button whose id = the id2 passed in
    const buttonElement = document.querySelector(`#${id2}`);
    // create a reference to classes that are attached to this button
    const classes = buttonElement.classList;
    // toggle the class name on this button (it's a font awesome icon class)
    classes[1] === 'fa-plus'
      ? classes.replace('fa-plus', 'fa-minus')
      : classes.replace('fa-minus', 'fa-plus');
  }

  return (
    <div className='grid min-h-screen place-content-center bg-gray-200'>
      <div className='w-[95vw] sm:w-[600px] rounded-lg border border-gray-400 bg-white'>

        {/* Search by name form */}
        <form action='#' className='m-2' id='searchByName'>
          <input type='text' id='name' name='name' placeholder='Search by name' value={searchByNameInput}
            className='text-md font-raleway w-full border-b-2 p-1 text-black hover:border-black focus:outline-none'
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'Search by name')}
            onChange={(e) => { setSearchByNameInput(e.target.value); }} />
        </form>

        {/* Seach by tag form */}
        <form action='#' className='m-2' id='searchByTag'>
          <input type='text' id='tagsSearch' name='tagsSearch' placeholder='Search by tag' value={searchByTagInput}
            className='text-md font-raleway w-full border-b-2 p-1 text-black hover:border-black focus:outline-none'
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'Search by tag')}
            onChange={(e) => { setSearchByTagInput(e.target.value); }} />
        </form>

        <div className='h-[62vh] overflow-auto'>
          {students.filter((student) => {
            //0. no search needed
            if (searchByNameInput === '' && searchByTagInput === '') return true;

            //1. search by name only
            else if (searchByNameInput !== '' && searchByTagInput === '') {
              //apply filter on searchByName only
              return student.firstName
                .concat(' ')
                .concat(student.lastName)
                .toUpperCase()
                .includes(searchByNameInput.toUpperCase());
            }

            //2. search by tag only
            else if (searchByTagInput !== '' && searchByNameInput === '') {
              // console.log(student.tags);

              //if student doesn't have any tags, then return false (filter)
              if (!student.tags) return false;
              //else if student has tags, apply filter on searchByTag only
              else if (student.tags) {
                let match = false;
                // console.log(match);
                student.tags.forEach((tag) => {
                  //console.log(student.tags[index]);
                  if (
                    tag.toUpperCase().includes(searchByTagInput.toUpperCase())
                  ) {
                    // console.log('match', searchByTagInput, tag);
                    // //return true; ???
                    match = true;
                  }
                });

                return match;
              }
            }

            //3. search by name and tag
            else if (searchByTagInput !== '' && searchByNameInput !== '') {
              //if student doesn't have any tags, then return false (filter)
              if (!student.tags) return false;
              //else if student has tags, apply filter on searchByTag only
              else if (student.tags) {
                let match = false;
                // console.log(match);
                student.tags.forEach((tag) => {
                  //console.log(student.tags[index]);
                  if (
                    tag.toUpperCase().includes(searchByTagInput.toUpperCase())
                  ) {
                    // console.log('match', searchByTagInput, tag);
                    // //return true; ???
                    match = true;
                  }
                });

                let searchNameMatch = student.firstName
                  .concat(' ')
                  .concat(student.lastName)
                  .toUpperCase()
                  .includes(searchByNameInput.toUpperCase());

                //if student passes both search by name match and tag name match, return it
                return searchNameMatch && match ? true : false;
              }
            }

            //default return is true, just in case
            return true;
          })
            .map((student, index) => {
              return (
                <div key={index} className='flex justify-between border-b'>
                  <div className='m-3 flex-none'>
                    <img
                      src={student.pic}
                      className='h-20 w-20 rounded-full border border-gray-400'
                      alt={student.company}
                    />
                  </div>

                  <div className='my-3 grow overflow-hidden'>
                    <div className='font-raleway cursor-default text-xl font-bold sm:text-3xl'>
                      {student.firstName.toUpperCase()}{' '}
                      {student.lastName.toUpperCase()}
                    </div>
                    <div className='font-raleway cursor-default pl-3 text-sm'>
                      Email: {student.email}
                      <br />
                      Company: {student.company}
                      <br />
                      Skill: {student.skill}
                      <br />
                      Average:{' '}
                      {student.grades.reduce((a, b) => a + parseInt(b), 0) /
                        student.grades.length}
                      %
                    </div>

                    {/* Print out student grades */}
                    <div id={student.company + index} className='js-hide mt-2'>
                      {student.grades.map((test, index) => {
                        return (
                          <div key={student.lastName + 'grades' + index}
                            className='font-raleway cursor-default pl-3 text-sm'>
                            Test {index + 1}:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}{test}%
                          </div>);
                      })}
                    </div>

                    {/* Print out tags, if student has tags */}
                    <div className='flex flex-wrap pl-3'>{displayTags(student)}</div>

                    {/* Form to add tags */}
                    <form onSubmit={(e) => { addTag(e, student); }} className='m-2'>
                      <input type='text' id='tag' name='tag' placeholder='Add a tag'
                        className='font-raleway border-b-2 p-1 text-sm text-black hover:border-black focus:outline-none'
                        onFocus={(e) => (e.target.placeholder = '')}
                        onBlur={(e) => (e.target.placeholder = 'Add a tag')} />
                    </form>
                  </div>

                  {/* 3rd flex column, containg button to open/close student grades panel  */}
                  <div className='mt-3 flex-none'>
                    <button className='px-3 text-2xl text-gray-400 hover:text-black sm:text-3xl'
                      onClick={() => toggleGrades(student.company + index, student.lastName + 'button')}>
                      <i id={student.lastName + 'button'} className='fas fa-plus'></i>
                    </button>
                  </div>

                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
