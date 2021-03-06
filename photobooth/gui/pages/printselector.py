import tkinter as tk

from photobooth.settings import config
from ..components.countdownbar import CountDownBar
from ..components.stripselector import StripSelector

class PrintSelector(tk.Frame):
    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent, bg=parent["bg"])
        self.controller = controller

        # Get the relative window size
        self.size = controller.containerSize

        # Get the container sizes
        self.padding = 50
        textHeight = 100
        countHeight = 25
        self.stripContainerHeight = self.size[1] - self.padding * 2 - textHeight - countHeight
        columnWidths = int( self.size[0] / 3 )


        # Set up the grid sizing
        self.grid_rowconfigure(0, weight=1)
        # self.grid_rowconfigure(1, weight=1)
        self.grid_columnconfigure(0, weight=1, minsize=columnWidths)
        self.grid_columnconfigure(1, weight=1, minsize=columnWidths)
        self.grid_columnconfigure(2, weight=1, minsize=columnWidths)

        # Keep references here of the the top and bottom text of the parent for future use
        self.topText = controller.topText
        self.botText = controller.botText


        # Get the photostrip instance
        self.photostrip = controller.photostrip

        # Size the grid
        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(0, weight=1)

        self.middleColumn = columnWidths / 2

        # The Colored Photostrip to display
        self.coloredImage = StripSelector(self, self.photostrip, option='color', selected=True)
        self.coloredImage.grid(row=0, column=0, sticky="nsew") 

        # The Grayscale Image
        self.grayscaleImage = StripSelector(self, self.photostrip, option='grayscale')
        self.grayscaleImage.grid(row=0, column=1, sticky="nsew") 

        # The Both Grayscale and Colored Image
        self.bothImage = StripSelector(self, self.photostrip, option='both')
        self.bothImage.grid(row=0, column=2, sticky="nsew") 

        # Create a count down bar
        self.countTime = config.getint('Interactions', 'stripCountDown')
        self.countDown = CountDownBar(self, maxTime=self.countTime, height=countHeight, callback=self.startPrint)
        self.countDown.grid(row=1, column=0, columnspan=3, sticky="nsew")

    def initializePage(self):
        # Update the text
        self.topText.updateText("Select print color")
        self.botText.updateText("Push button to change")
        # Generate new photostrips
        self.photostrip.generateStrip()
        self.photostrip.resizeScreenIMGs( height=self.stripContainerHeight )
        # Update the display images with any new values
        self.coloredImage.updatePicture()
        self.grayscaleImage.updatePicture()
        self.bothImage.updatePicture()
        # Set the toggled values
        self.coloredImage.toggleOn()
        self.grayscaleImage.untoggle()
        self.bothImage.untoggle()
        # start the count down
        self.countDown.start()
        # Bind space bar to toggle the next option
        self.bindID = self.bind('<space>', self.toggleNext)

    # Depending on the currently selected select the next one
    def toggleNext(self, event):
        if self.coloredImage.selected:
            self.coloredImage.toggleSelected()
            self.grayscaleImage.toggleSelected()

        elif self.grayscaleImage.selected:
            self.grayscaleImage.toggleSelected()
            self.bothImage.toggleSelected()

        elif self.bothImage.selected:
            self.bothImage.toggleSelected()
            self.coloredImage.toggleSelected()

    def startPrint(self):
        self.unbind('<space>', self.bindID)
        self.controller.printImage = self.getSelectedImage()
        self.controller.showNextPage()

    def getSelectedImage(self):
        if self.coloredImage.selected:
            selected = "color"
        elif self.grayscaleImage.selected:
            selected = "grayscale"
        elif self.bothImage.selected:
            selected = "both"

        self.photostrip.deleteUnSelected(selected)
        return self.photostrip.getPrintFile(selected)



