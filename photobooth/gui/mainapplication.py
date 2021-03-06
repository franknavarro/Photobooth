import tkinter as tk

from photobooth.pictures import photostrip

from .components.labeltext import LabelText

from .pages.camerapage import CameraPage
from .pages.printselector import PrintSelector
from .pages.printpage import PrintPage

class MainApplication(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg=parent["bg"])
        self.controller = controller

        # Initialize the photostrip
        self.photostrip = photostrip
        self.printImage = ""

        # Calculate sizes for our various frames
        self.size = controller.get_size()

        self.textWidth = self.size[0]
        self.textHeight = 200
        self.textSize = (self.textWidth, self.textHeight)

        self.containerWidth = self.size[0]
        self.containerHeight = int(self.size[1] - self.textHeight*2)
        self.containerSize = (self.containerWidth, self.containerHeight)

        print("Screen Size: {}w, {}h".format(self.size[0], self.size[1]))


        # Initialize the grid
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1, minsize=self.textHeight)
        self.grid_rowconfigure(1, weight=1, minsize=self.containerHeight)
        self.grid_rowconfigure(2, weight=1, minsize=self.textHeight)


        # Initialize the text above the camera
        self.topText = LabelText(self, "PHOTOBOOTH")
        self.topText.grid(row=0, column=0, sticky="nsew")

        # Initialize the text below the camera
        self.botText = LabelText(self, "PUSH BUTTON TO START")
        self.botText.grid(row=2, column=0, sticky="nsew")

        # Create container to hold both the Camera Page and the Printing Page
        self.container = tk.Frame(self, bg=self["bg"])
        self.container.grid(row=1, column=0, sticky="nsew")
        self.container.grid_rowconfigure(0, weight=1)
        self.container.grid_columnconfigure(0, weight=1)

        # Initialize the Camera Frame
        self.frames = {}
        self.framesList = (CameraPage, PrintSelector, PrintPage)
        self.frameIndex = 0
        for page in self.framesList:
            frame = page(self.container, self)
            self.frames[page] = frame
            frame.grid(row=0, column=0, stick="nsew")


    def open(self):
        # Start the application with the camera page
        self.setUpCameraPage()

    # A function to return the camera page
    # Mainly used for the key bindings in the root window
    def getCameraPage(self):
        return self.frames[CameraPage]


    # Function to display a loaded frame in the app
    def show_frame(self, page):
        frame = self.frames[page]
        frame.initializePage()
        frame.focus_set()
        frame.tkraise()

    # Show the camera page and reset the strip
    def setUpCameraPage(self):
        self.photostrip.reset()
        self.printImage = ""
        self.show_frame(CameraPage)
        self.frameIndex = 0


    # Function to sequencially go through the pages of the application
    def showNextPage(self):
        self.frameIndex += 1
        if (self.frameIndex > 2 ):
            self.frameIndex = 0
        nextPage = self.framesList[self.frameIndex]
        self.show_frame(nextPage)

