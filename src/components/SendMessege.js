import React, { Component } from 'react'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import uniqid from 'uniqid'

export default class SendMessege extends Component {
    state = {
        activeTemplateID: '0',
        templates: [
            {   
                id: '0',
                name: "Template One",
                content: "Content One"
            },
            {
                id: '1',
                name: "Template Two",
                content: "Content Two"
            }
        ],
        phoneNumbers: ['sdfljklsdf', 'lsjlfjsdl']
    }

    handleSelect = (e) => {
        this.setState({ "activeTemplateID": e.target.value})
    }
    getActiveTemplate = (activeTemplateID, templates) => {
        let activeTemplate;
        templates.forEach(template => {
            if(template.id === activeTemplateID) {
                activeTemplate = template
            }
        })
        return activeTemplate
    }
    handleNumberInput = (e) => {
        e.preventDefault()
        const numberForm = document.getElementById("number-form")

        // Validate Phone number
        const numberInput = document.getElementById("number-input").value
        const phoneObj = parsePhoneNumberFromString(numberInput, 'US')
        if (phoneObj) {
            this.setState(prevState => {
                if(phoneObj.isValid() === true) {
                    const phoneNumberList = prevState.phoneNumbers.concat(phoneObj.formatNational())
                    console.log(phoneObj.nationalNumber)
                    return {'phoneNumbers':phoneNumberList}
                } 
            })
        } else {
            this.displayError("Please enter valid phone number", "number-form")
        }
        // Clear Form
        numberForm.reset()
    }
    displayError = (error, elementID) => {
        const element = document.getElementById(elementID)
        const Ptag = document.createElement("p")
        Ptag.innerHTML = error
        element.appendChild(Ptag)
    }
    handleCreateTemplate = (e) => {
        e.preventDefault()

        const templateNameInput = document.querySelector("#create-template-form > input").value
        const templateContentInput = document.querySelector("#create-template-form > textarea").value
        const createTemplateForm = document.getElementById('create-template-form')
        console.log(uniqid())
        
        const newTemplate = {
            "id": uniqid(),
            "name": templateNameInput,
            "content": templateContentInput
        }

        this.setState(prevState => {
            const templateList = prevState.templates.concat(newTemplate)
            return {"templates": templateList}
        })
        
        createTemplateForm.reset()
    }
    

    render() {
        const templates = this.state.templates
        const activeTemplateID = this.state.activeTemplateID
        const templateOptions = this.state.templates.map((template, index) => {
            return <option key={index} value={template.id}>{template.name}</option>
        })
        const activeTemplate = this.getActiveTemplate(activeTemplateID, templates)
        const phoneNumbers = this.state.phoneNumbers.map((number, index) => {
            return <li key={index}>{number}</li>
        })

        return (
            <div>
                <form id="create-template-form" onSubmit={e => this.handleCreateTemplate(e)}>
                    <h3>Create New Template</h3>
                    <h5>Template Name</h5>
                    <input type="text"/>
                    <h5>Add Template Content</h5>
                    <textarea name="" id="" cols="50" rows="3"></textarea>
                    <button type="submit">Create Template</button>
                </form>

                <form id="select-number-form">
                    <h3>Select Template</h3>
                    <select id="phoneNumbers" onChange={e => this.handleSelect(e)} >
                        {templateOptions}
                    </select>
                    <div className="active-template">
                        <p>{activeTemplate.content}</p>
                    </div>
                </form>

                <form id="number-form" onSubmit={e => this.handleNumberInput(e)}>
                    <h3>Enter Numbers</h3>
                    <ul>
                        {phoneNumbers}
                    </ul>
                    <input type="text" id="number-input"/>
                    <button type="submit">Add Number</button>
                </form>
            </div>
        )
    }
}
