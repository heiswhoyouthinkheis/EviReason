# edits:
# previously the sequence of the variables remains unchanged while the sequence of causal information changes
#   for example, in the cause first case A -> V, V -> B, A -> V -> B
#   while in the effect first condition  V -> A, B -> V, B -> V -> A
#   in the new edits, the causal properties stick to the variables, i.e., if a variable is a cause in the 
#   cause first condition, it is also a cause in the effect first condition. To instantiate:
#   in the cause first condition  A -> V, V -> B, A -> V -> B
#   in the effect first condition V -> B, A -> V, A -> V -> B
#   by doing so, the image generation and access will be easier and cleaner
#   the edits are done in the area where the following variables are defined:
#   cause_first_h = {}
#   cause_first_n = {}
#   effect_first_h = {}
#   effect_first_n = {}
#
#   TODO change the target hypothesis node in the images used in the second block. refer to sample trials doc.
#
import os
from psychopy import visual, core, event, gui, data
import numpy as np
import random
import pandas as pd
from itertools import product, combinations, permutations,combinations_with_replacement

# Initialize the PsychoPy window with specific size, background color, and units
win = visual.Window(size=(1920, 1080), color=[0.96, 0.96, 0.86], units='pix', fullscr = True, useRetina=True)
# pix = win._getPixels()
window_size = win.size

# Set font and text properties
font = 'Arial'
text_color = [-1, -1, -1]
text_size = 22



#---------------------set up stimlus sequence-------------------------------------------

# region sequence setup



# 19 hormone and neurotransmitter names 
# also subset one target variable to be the target hypothesis
hlist = pd.read_csv("D:/Desktop/CODE/exp_e/substance_list.csv")
# hlist = pd.read_excel("C:/Users/Brain Yan/Desktop/evi/substance_list.xlsx")
hormones = list(hlist['Hormones'])
neuro = list(hlist['NeuroT'])
names = list(hlist['Names'])

# Generate possible conditional probabilities
condi = ["lo", "me", "hi"]
condprobs = list(product(condi,condi))

# get list of names for assignment to each trial
randnames = random.sample(names,18)
blk1_names = randnames[0:9]
blk2_names = randnames[9:18]

# create homones couples
hormone_couple = [hormones[i:i+2] for i in range(0,len(hormones),2)]
target_hormone = hormone_couple[-1][0]
hormone_couple = hormone_couple[0:-1]

neuro_couple = [neuro[i:i+2] for i in range(0,len(neuro),2)]
target_neuro = neuro_couple[-1][0]
neuro_couple = neuro_couple[0:-1]



# initialize input list for both blocks
input_list_h = []
input_list_n = []

for hormone, condi in zip(hormone_couple,condprobs):
    input_list_h.append([hormone,condi,['cause','effect']])

for neuro, condi in zip(neuro_couple,condprobs):
    input_list_n.append([neuro,condi,['cause','effect']])


lo_options = np.arange(20,30,2)
me_options = np.arange(45,55,2)
hi_options = np.arange(75,85,2)

cp1 = []
cp2 = []


# this gives me a list of inputs that can be put in the text template

for input_h,input_n in zip(input_list_h,input_list_n):
    if input_h[1][0] == 'lo':
        cp1 = random.choice(lo_options)
    elif input_h[1][0] == 'me':
        cp1 = random.choice(me_options)
    elif input_h[1][0] == 'hi':
        cp1 = random.choice(hi_options)

    if input_h[1][1] == 'lo':
        cp2 = random.choice(lo_options)
    elif input_h[1][1] == 'me':
        cp2 = random.choice(me_options)
    elif input_h[1][1] == 'hi':
        cp2 = random.choice(hi_options)

    input_h.append([cp1, cp2])
    input_n.append([cp1, cp2])
    # returned are two lists (input_list_h and input_list_n)
    

# manually make sure that the matched conditions have exactly matched values in condprb
for i in input_list_h:
    if i[1] == ('lo','lo'):
        i[3] = [25,25]
    elif i[1] == ('me','me'):
        i[3] = [50,50]
    elif i[1] == ('hi','hi'):
        i[3] = [80,80]

for i in input_list_n:
    if i[1] == ('lo','lo'):
        i[3] = [25,25]
    elif i[1] == ('me','me'):
        i[3] = [50,50]
    elif i[1] == ('hi','hi'):
        i[3] = [80,80]

# example of items in input_list_h
# [['Aurelin', 'Bionexin'], ('lo', 'lo'), ['cause', 'effect'], [25, 25]]

# Define the cases for partA of a case
# var = name of the cause, n = frequency of successful cause, CorE takes 'cause' or 'effect'
# the function returns a dictionary, in which the keys are the categorical conditional probability pairs
#   namely, the 3 x 3 conditions
#   there are 4 values corresponding to every key, in order they are 0. the first instructions in a trial
#   1. the second instructions, 2.the initial of the first variable, 3. the initials of the both variables
#   2. and 3. are used to access the Bayes nets images 
#   TODO consider adding the cause/effect-first condition   
#


def set_text_h(var_a, var_b, n_a, n_b, CorE_a, CorE_b, tar, name):
    partA = f"You know that the presence of {var_a} is a {CorE_a} of {tar}.\n\n \
    In 100 Groblins, on average, 5 of them has {tar}.\n \
    In 100 Groblins who have {var_a}, {n_a} of them also have {tar}.\n \
    In 100 Groblins who do not have {var_a}, 2 of them have {tar}.\n \
    In 100 Groblins, on average, 5 of them have {var_a}.\n\n \
    A Groblin, named {name}, has {var_a}. \n \
    How likely do you think that {name} has {tar}?"

    partB = f"You also know that the presence of {var_b} is a {CorE_b} of {tar}.\n\n \
    In 100 Groblins who have {var_b}, {n_b} of them also have {tar}.\n \
    In 100 Groblins who do not have {var_a}, 2 of them have {tar}.\n \
    In 100 Groblins, on average, 5 of them have {var_b}.\n\n \
    Now with further investigation, you found that {name} also has {var_b}. \n \
    How likely do you think that {name} has {tar}?"

    var_1 = var_a[0]
    if CorE_a == 'cause':
        var_2 = var_a[0] + var_b[0]
    elif CorE_a == 'effect':
        var_2 = var_b[0] + var_a[0]

    return partA,partB,var_1,var_2

def set_text_n(var_a, var_b, n_a, n_b, CorE_a, CorE_b,tar, name):
    partA = f"You know that the release of {var_a} is a {CorE_a} of {tar} release.\n\n \
    In 100 Oxters, on average, 5 of them release {tar}.\n \
    In 100 Oxters who release {var_a}, {n_a} of them also release {tar}.\n \
    In 100 Oxters who do not release {var_a}, 2 of them release {tar}.\n \
    In 100 Oxters, on average, 5 of them release {var_a}.\n\n \
    An Oxter, named {name}, is found to release {var_a}. \n \
    How likely do you think that {name} releases {tar}?"

    partB = f"You also know that the release of {var_b} is a {CorE_b} of {tar} release.\n\n \
    In 100 Oxters who release {var_b}, {n_b} of them also release {tar}.\n \
    In 100 Oxters who do not release {var_b}, 2 of them release {tar}.\n \
    In 100 Oxters, on average, 5 of them release {var_b}.\n\n \
    Now with further investigation, you found that {name} also releases {var_b}. \n \
    How likely do you think that {name} releases {tar}?"

    var_1 = var_a[0]
    if CorE_a == 'cause':
        var_2 = var_a[0] + var_b[0]
    elif CorE_a == 'effect':
        var_2 = var_b[0] + var_a[0]

    return partA,partB,var_1,var_2


cause_first_h = {}
cause_first_n = {}
effect_first_h = {}
effect_first_n = {}

# generate case info for all conditions
for i,case, caseN in zip(range(len(input_list_h)),input_list_h, input_list_n):
    conditions = case[1]

    # cause_first[conditions]={}

    cause_first_h[conditions] = set_text_h(case[0][0],case[0][1],case[3][0],case[3][1],case[2][0],case[2][1],target_hormone,blk1_names[i])
    effect_first_h[conditions] = set_text_h(case[0][1],case[0][0],case[3][0],case[3][1],case[2][1],case[2][0],target_hormone,blk1_names[i])
    cause_first_n[conditions] = set_text_n(caseN[0][0],caseN[0][1],caseN[3][0],caseN[3][1],caseN[2][0],caseN[2][1],target_neuro,blk2_names[i])
    effect_first_n[conditions] = set_text_n(caseN[0][1],caseN[0][0],caseN[3][0],caseN[3][1],caseN[2][1],caseN[2][0],target_neuro,blk2_names[i])


#-----------------------start randomization of sequences---------------------------------------------

# randomly shuffle the list of available (categorical) conditional probabilities
random.seed(5)
cond_1 = random.sample(condprobs,9)

# subset the first 4 element of it as keys for getting the cause first conditions for the !!! first !!! block
c_first_keys = cond_1[0:4]
e_first_keys = cond_1[-5:]

# combine the text accessed from both c and e first dictionary and put them into a list for randomization
# hormones
blk_1_list = [(key,cause_first_h[key]) for key in c_first_keys] + [(key,effect_first_h[key]) for key in e_first_keys ]
random.seed('blk1')
random.shuffle(blk_1_list)

# neuroT, the keys are the corresponding counterparts of those for the first block
blk_2_list = [(key,cause_first_n[key]) for key in e_first_keys] + [(key,effect_first_n[key]) for key in c_first_keys ]
random.seed('blk2')
random.shuffle(blk_2_list)

# convert it back to dictionary
blk_1 = dict(blk_1_list)
blk_2 = dict(blk_2_list)


# so the keys in (blk_1) would serve as order trackers. 

# initialize keys for recording
blk_1_record = {}
# blk_1_record['variables'] = []
blk_1_record['strength'] = list(blk_1.keys())
blk_1_record['value'] = []
blk_1_record['info_order'] = []
blk_1_record['probabilities'] = []

blk_2_record = {}
blk_2_record['strength'] = list(blk_2.keys())
blk_2_record['value'] = []
blk_2_record['info_order'] = []
blk_2_record['probabilities'] = []

# record the corresponding pairs of variables e.g. ['Aurelin','Bioexin']
# this will later be used to set the sequence of images for the corresponding trials
# for case in list(blk_1.keys()):
#     for items in input_list_h:
#         if case == items[1]:
#             blk_1_record['variables'].append(items[0])


# record corresponding values to causal strength
for case in list(blk_1.keys()):
    for items in input_list_h:
        if case == items[1]:
            blk_1_record['value'].append(items[3])

for case in list(blk_2.keys()):
    for items in input_list_n:
        if case == items[1]:
            blk_2_record['value'].append(items[3])

# record information display order (cause or effect first)
for case in list(blk_1.keys()):
    if case in c_first_keys:
        blk_1_record['info_order'].append('cause')
    elif case in e_first_keys:
        blk_1_record['info_order'].append('effect')

for case in list(blk_2.keys()):
    if case in e_first_keys:
        blk_2_record['info_order'].append('cause')
    elif case in c_first_keys:
        blk_2_record['info_order'].append('effect')





# region instructions ------------------------------------------------------------------------------

# Define the instruction texts for block 1 to be displayed to participants

# wording considerations
# 1. informative vs. correlate
instructions_1 = [
    ("In year 3021, you are assigned to a local clinic on planet p32 because of " 
     "the increasing demand for doctors who specialize in medical treatment for " 
     "the native aliens, Groblins. You have a manual that records how certain " 
     "hormones correlate with other hormones in the Groblin bodies."),
    ("The balance of bodily hormones is essential for the health of Groblins. "
    f"Unfortunately, a dysfunctional presence of the hormone {target_hormone} is spreading across the "
    "local Groblin population. Your clinic is flooded with concerned Groblins, "
    f"who are worried that they might have {target_hormone} in their bodies. To make things worse, "
    f"the apparatus that tests for {target_hormone} is broken. "),
    (f"You remember about the manual you brought. With the information in the "
    "manual, you can infer from the presence or absence of other easily testable "
    f"hormones to judge whether {target_hormone} is present in the Groblin. "),
    ("In the following task, a group of Groblins will approach you for medical diagnosis. "
    f"For each Groblin, you will be required to make a judgment about whether {target_hormone} " 
    "is present in them. You will make this judgment from information about relevant hormones " 
    "that is available to you. "),
    ("Due to the diversity of Groblins’ bodily makeup, each case is independent. That is, "
    "the information for each Groblin does not carry over to any other Groblins. "
    "However, you will need to use all information from one Groblin "
    "to perform a diagnosis for that Groblin. "),
    ("After gathering the information from the Groblin and the manual, "
    f"you will make a judgment on how likely the Groblin has {target_hormone}. "
    "To make the judgment, drag the slider until you find the desired probability. "
    "After you have made your judgment, a [continue] button will appear on the screen. "
    "Once the button is pressed, you will not be able to modify your judgment again. "),
]

# Define the instruction texts for block 2 to be displayed to participants
instructions_2 = [
    ("In year 3022, you are assigned to planet p56 to study the activities of neurotransmitters "
    "in the native aliens, Oxters. Your predecessors have left you a manual that records how " 
    "certain neurotransmitters correlate with other neurotransmitters in the Oxter bodies."),
    ("With the information in the manual, you can infer from the release of some neurotransmitters"
    f"to judge whether an Oxter releases a specific neurotransmitters, {target_neuro}."),
    ("As part of your qualification exam, you will be presented with a set of diagnostic cases." 
    "In each, an Oxter approaches you and you are required to make a judgment about whether they"
    f"have a release of {target_neuro}."),
    (f"Although the status of your target neurotransmitter, {target_neuro}, is not directly"
    "available to you, you will be able to gather information about the release"
    f"of other neurotransmitters to predict the presence of {target_neuro}."),
    ("Due to the diversity of Oxters’ bodily makeup, each case is independent. That is,"
    "the information in each case does not carry over to any other cases."
    "However, you will need to use all information presented within each case"
    "to make a judgment for that case."),
    ("After gathering the information from the Oxter and the manual,"
    f"you will make a judgment on how likely the Groblin has a {target_neuro} release."
    "To make the judgment, drag the slider until you find the desired probability."
    "After you have made your judgment, a [continue] button will appear on the screen. "
    "Once the button is pressed, you will not be able to modify your judgment again. ")
    ]

# instructions_1 = ['test_1']
# instructions_2 = ['test_2']

# region inst function

# Function to display text instructions and wait for the participant to press the space key to proceed
def show_instructions(text):
    # Create a TextStim object to display the instruction text
    message = visual.TextStim(win, text=text, color=text_color, antialias=True, height=text_size, wrapWidth=window_size[0]*2/3)
    space_to_continue = visual.TextStim(win, text="Press [space] to continue.", color=text_color, pos = (0,-window_size[1]*1/4), height=text_size)
    # Draw the text on the window
    message.draw()
    space_to_continue.draw()

    # Flip the window buffer to display the drawn text
    win.flip()
    # Wait for the participant to press the space key
    event.waitKeys(keyList=['space'])


# region runcase function

# Set continue attributes
margin_x = 20
margin_y = 20

rect_height = 60
rect_width = 160

continue_x = window_size[0]/2 - margin_x - rect_width/2
continue_y = -window_size[1]/2 + margin_y + rect_height/2

# Create a rectangular "Continue" button for participants to proceed after making their estimation
continue_button = visual.Rect(win, width=rect_width, height=rect_height, pos=(continue_x,continue_y), fillColor='grey', lineColor='black')

# Create a TextStim object to label the "Continue" button
continue_text = visual.TextStim(win, text='Continue', pos=(continue_x,continue_y), height=30, color=text_color, font=font, antialias=True)

# set slider_text
slider_text_1 = [f"{target_hormone} is absent", f"{target_hormone} is present"]
slider_text_2 = [f"{target_neuro} is absent", f"{target_neuro} is present"]


print('initial setup')

# run case function
def run_case(case,slider_text):

    probs = []

    # Create TextStim objects for the two subcases
    case_text_1 = visual.TextStim(win, text=case[0], pos=(200, 275), height=20, color=text_color, font=font, antialias=True, wrapWidth=window_size[0]*2/3)
    case_text_2 = visual.TextStim(win, text=case[1], pos=(200, -150), height=20, color=text_color, font=font, antialias=True, wrapWidth=window_size[0]*2/3)

    # # define path to image
    image_path_1 = os.path.join(f"D:/Desktop/CODE/exp_e/images/causal/duo/{str(case[2])}.png")
    image_path_2 = os.path.join(f"D:/Desktop/CODE/exp_e/images/causal/tri/{str(case[3])}.png")

    print(image_path_1)

    # Access images
    image_1 =  visual.ImageStim(win, image = image_path_1, pos = ((-window_size[0]/3+100-window_size[0]/3)/2,250), size = (360, 160), texRes = 1024)
    image_2 =  visual.ImageStim(win, image = image_path_2, pos = ((-window_size[0]/3+100-window_size[0]/3)/2,-150), size = (560, 160), texRes = 128)

    # Check if the image is loaded successfully
    if not image_1.image:
        print("Error loading image. Check the file path.")
    else:
        print("Image loaded successfully.")

    # Create sliders for the two subcases
    slider_1 = visual.Slider(win, ticks=(0, 1), pos=(0, 100), labels= slider_text, labelHeight=20, granularity=0.01, 
    style='rating', labelColor='Black', markerColor='Grey', lineColor='Black',size=(800, 20), 
    color='Black', fillColor='Grey', borderColor='Black')
    
    print('slider 1 set')

    slider_2 = visual.Slider(win, ticks=(0, 1), pos=(0, -300), labels= slider_text, labelHeight=20, granularity=0.01, 
    style='rating', labelColor='Black', markerColor='Grey', lineColor='Black',size=(800, 20), 
    color='Black', fillColor='Grey', borderColor='Black')

    print('slider 2 set')

    # Create the estimated probability text
    estimated_prob_1 = visual.TextStim(win, text='', pos=(0, 50), height=20, color=text_color, antialias=True)
    estimated_prob_2 = visual.TextStim(win, text='', pos=(0, -350), height=20, color=text_color, antialias=True)

    # Getting the mouse for later detection
    mouse = event.Mouse(win=win)

    slider_1.reset()
    slider_2.reset()

    # The continue button will not show when flipped
    continue_visible = False

    # Variable to track which subcase is being displayed
    subcase_index = 0

    while True:
        # Draw the case information text and slider for the first subcase
        case_text_1.draw()
        image_1.draw()
        slider_1.draw()

        # Get the current position of the slider marker for the first subcase
        est_prob_value_1 = slider_1.markerPos
        if est_prob_value_1 is not None:
            # Update the estimated probability text based on the slider position
            estimated_prob_1.text = f"estimated probability: {est_prob_value_1:.2f}"
            # Draw the estimated probability text
            estimated_prob_1.draw()
            continue_visible = True
            
        if continue_visible:
            # Draw the "Continue" button
            continue_button.draw()
            # Draw the "Continue" button label
            continue_text.draw()

        # Flip the window buffer to display all drawn components
        win.flip()

        # Check if the mouse is pressed inside the "Continue" button
        if continue_visible and mouse.isPressedIn(continue_button):
            # Wait for the mouse to be released
            while mouse.getPressed()[0]:
                pass
            # Store the estimated probability value for the first subcase
            probs.append(est_prob_value_1)

            # lock slider value
            slider_1.readOnly = True

            # Move to the second subcase
            subcase_index = 1
            break

        # Check if the escape key is pressed to quit the experiment
        if event.getKeys(keyList=['escape']):
            core.quit()

    # The continue button will not show when flipped
    continue_visible = False

    while True:
        # Draw the case information text and slider for the first subcase
        case_text_1.draw()
        estimated_prob_1.draw()
        image_1.draw()
        image_2.draw()
        slider_1.draw()

        # Draw the case information text and slider for the second subcase
        case_text_2.draw()
        slider_2.draw()

        # Get the current position of the slider marker for the second subcase
        est_prob_value_2 = slider_2.markerPos
        if est_prob_value_2 is not None:
            # Update the estimated probability text based on the slider position
            estimated_prob_2.text = f"estimated probability: {est_prob_value_2:.2f}"
            # Draw the estimated probability text
            estimated_prob_2.draw()
            continue_visible = True
            
        if continue_visible:
            # Draw the "Continue" button
            continue_button.draw()
            # Draw the "Continue" button label
            continue_text.draw()

        # Flip the window buffer to display all drawn components
        win.flip()

        # Check if the mouse is pressed inside the "Continue" button
        if continue_visible and mouse.isPressedIn(continue_button):
            # Wait for the mouse to be released
            while mouse.getPressed()[0]:
                pass
            # Store the estimated probability value for the second subcase
            probs.append(est_prob_value_2)

            # lock slider
            slider_2.readOnly = True
            return probs

        # Check if the escape key is pressed to quit the experiment
        if event.getKeys(keyList=['escape']):
            core.quit()



#---------------------display-------------------------------------------------------------------
# region display

start_text = "Press [space] to start the experiment"
start = visual.TextStim(win, text=start_text, color=text_color, height=text_size, antialias=True)
# Draw the text on the window
start.draw()
# Flip the window buffer to display the drawn text
win.flip()
# Wait for the participant to press the space key
event.waitKeys(keyList=['space'])

# Display each instruction text one by one
for instruction in instructions_1:
    while True:
        show_instructions(instruction)

        if event.getKeys(keyList=['escape']):
            core.quit()
        
        break
    

# now initiate the task
for case in list(blk_1.keys()):
    probs = run_case(blk_1[case],slider_text_1)
    blk_1_record['probabilities'].append(probs)

transi_text = "The first task is completed. Please press [space] to proceed to the next task."
transi = visual.TextStim(win, text=transi_text, color=text_color, height=text_size, antialias=True)
# Draw the text on the window
transi.draw()
# Flip the window buffer to display the drawn text
win.flip()
# Wait for the participant to press the space key
event.waitKeys(keyList=['space'])

for instruction in instructions_2:
    while True:
        show_instructions(instruction)

        if event.getKeys(keyList=['escape']):
            core.quit()
        
        break

# now initiate the task
for case in list(blk_2.keys()):
    probs = run_case(blk_2[case],slider_text_2)
    blk_2_record['probabilities'].append(probs)


print(blk_1_record)
print(blk_2_record)

# Close the PsychoPy window
win.close()
# Quit the PsychoPy core
core.quit()




# "imbalance -> presence" check
# past tense -> current check
# base rate or frequency of target h when evidence is absent?
# graphs
# counterbalance