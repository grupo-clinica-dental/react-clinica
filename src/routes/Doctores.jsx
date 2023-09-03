import React, { Component } from 'react'

export class Registro extends Component {
  render() {
    return (
        <>
            <div>
                <label for="exampleFormControlInput1" className="form-label">Usuario_id</label>
                <br></br>
                <input type="text" className="form-control" id="exampleFormControlInput1"></input>
            </div>
            <div>
                <label for="exampleFormControlInput1" className="form-label">fecha de borrador</label>
                <br></br>
                <input type="text" className="form-control" id="exampleFormControlInput1"></input>
            </div>
            <div>
                <label for="exampleFormControlInput1" className="form-label">Color</label>
                <br></br>
                <input type="color"></input>
            </div>
            <table>
                
            </table>
        </>
    )
  }
}

export default Registro