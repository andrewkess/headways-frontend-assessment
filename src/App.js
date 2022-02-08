import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [searchByNameInput, setSearchByNameInput] = useState('');
  const [searchByTagInput, setSearchByTagInput] = useState('');

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    async function getStudents() {
      // read our JSON
      let response = await fetch(
        'https://api.hatchways.io/assessment/students'
      );
      let user = await response.json();
      //      console.log(user.students);
      setStudents(user.students);
    }
    getStudents();
  }, []);

  //   useEffect(() => {
  //     const result = students.filter(student => student.firstName.includes(searchInput));
  //     console.log(result);
  // //    setStudents(user.students);
  //   }, [students, searchInput]);

  function addTag(event, student) {
    event.preventDefault();
    let currentStudents = [...students];
    currentStudents.forEach((stud, index, array) => {
      //if student doesn't arlready have a 'tags' property (array)
      if (stud.id === student.id && !stud.hasOwnProperty('tags')) {
        //add new 'tags' property which is a new array containing tag value sent in by form
        currentStudents[index].tags = [event.target.tag.value];
      }
      //else if student already has a tag property array, simply push the new tag into array
      else if (stud.id === student.id && stud.hasOwnProperty('tags')) {
        currentStudents[index].tags.push(event.target.tag.value);
      }
    });

    setStudents(currentStudents);
    event.target.tag.value = '';
  }

  function displayTags(student) {
    if (student.hasOwnProperty('tags')) {
      return student.tags.map((tag, index) => {
        return (
          <div
            key={tag + index}
            className="rounded-md mt-2 px-2 py-1 bg-gray-300 mr-1 text-sm font-raleway cursor-default"
          >
            {tag}
          </div>
        );
      });
    }
  }

  function toggleGrades(id1, id2) {
    //    console.log('updated students', students);

    const gradesElement = document.querySelector(`#${id1}`);
    gradesElement.classList.toggle('js-hide');

    const buttonElement = document.querySelector(`#${id2}`);
    //    buttonElement.innerHTML('-');
    //    let contents = buttonElement.innerHTML;
    const classes = buttonElement.classList;

    classes[1] === 'fa-plus'
      ? classes.replace('fa-plus', 'fa-minus')
      : classes.replace('fa-minus', 'fa-plus');
  }

  return (
    <div className="bg-gray-200 p-20 min-h-screen">
      <div className="bg-white border border-gray-400 rounded-lg max-w-xl container mx-auto">
        <form action="#" className="m-2" id="searchByName">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Search by name"
            value={searchByNameInput}
            className="p-1 border-b-2 hover:border-black text-md font-raleway w-full focus:outline-none text-black"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'Search by name')}
            onChange={(e) => {
              //            console.log('onchange is triggered');
              setSearchByNameInput(e.target.value);
            }}
          />
        </form>

        <form action="#" className="m-2" id="searchByTag">
          <input
            type="text"
            id="tagsSearch"
            name="tagsSearch"
            placeholder="Search by tag"
            value={searchByTagInput}
            className="p-1 border-b-2 hover:border-black text-md font-raleway w-full focus:outline-none text-black"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'Search by tag')}
            onChange={(e) => {
              //            console.log('onchange is triggered');
              setSearchByTagInput(e.target.value);
            }}
          />
        </form>

        <div className="h-[62vh] overflow-auto">
          {students
            .filter((student) => {
              //0. no search needed
              if (searchByNameInput === '' && searchByTagInput === '') {
                return true;
              }

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
                //                console.log(student.tags);

                //if student doesn't have any tags, then return false (filter)
                if (!student.tags) return false;
                //else if student has tags, apply filter on searchByTag only
                else if (student.tags) {
                  let match = false;
                  // console.log(match);
                  student.tags.forEach((tag) => {
                    //console.log(student.tags[index]);
                    if (tag.includes(searchByTagInput)) {
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
                    if (tag.includes(searchByTagInput)) {
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
                <div key={index} className="flex justify-between border-b">
                  <div className="m-3 flex-none">
                    <img
                      src={student.pic}
                      className="w-20 h-20 rounded-full border border-gray-400"
                      alt={student.company}
                    />
                  </div>

                  <div className="my-3 grow">
                    <div className="font-bold text-3xl font-raleway cursor-default">
                      {student.firstName.toUpperCase()}{' '}
                      {student.lastName.toUpperCase()}
                    </div>
                    <div className="pl-3 text-sm font-raleway cursor-default">
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

                    <div id={student.company + index} className="js-hide mt-2">
                      {student.grades.map((test, index) => {
                        return (
                          <div
                            key={student.lastName + 'grades' + index}
                            className="pl-3 text-sm font-raleway cursor-default"
                          >
                            Test {index + 1}:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
                            {test}%
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap pl-3">
                      {displayTags(student)}
                    </div>

                    <form
                      onSubmit={(e) => {
                        addTag(e, student);
                      }}
                      className="m-2"
                    >
                      <input
                        type="text"
                        id="tag"
                        name="tag"
                        placeholder="Add a tag"
                        className="p-1 border-b-2 hover:border-black text-sm font-raleway focus:outline-none text-black"
                        onFocus={(e) => (e.target.placeholder = '')}
                        onBlur={(e) => (e.target.placeholder = 'Add a tag')}
                        //            console.log('onchange is triggered');
                        // setTagInput(e.target.value);

                        // onChange={(e) => {
                        //   handleEditInputChange(e, students[index]);
                        //   //console.log('student', students[index]);
                        // }}

                        // onChange={(e) => {
                        //   const { value } = e.target;
                        //   console.log('onchange', value);
                        //   console.log(students[index].firstName);
                        //   setStudents((prevState) => [
                        //     ...prevState,
                        //     (students[index].firstName = 'Mike'),
                        //   ]);
                        //   console.log(students[index].firstName);

                        //                          setInput(value);
                        // }}
                      />
                    </form>
                  </div>

                  <div className="mt-3 flex-none">
                    <button
                      className="px-3 text-3xl text-gray-400 hover:text-black"
                      onClick={() =>
                        toggleGrades(
                          student.company + index,
                          student.lastName + 'button'
                        )
                      }
                    >
                      <i
                        id={student.lastName + 'button'}
                        className="fas fa-plus"
                      ></i>
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
