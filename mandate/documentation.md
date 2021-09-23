# Introduction

# Abstract

The Fourier Transform operator is used everywhere. <br>
Mathematically, it's just taking a periodic function and <br>
decomposing it into its sine and cosine components. <br>
In the real world, they are used in a lot of applications. <br>
The most famous use case is signal processing. <br>
Have you ever wondered how Shazam works? Fourier Transform! <br>
They are also used to remove background noise from your microphone. <br>

# Scope

The scope is to write a website to facilitate the <br>
understanding of the Fourier Series.

# Requirements analysis

| ID                   | Req-00
|----------------------|--------|
| Name:                | Content
| Priority:            | 1
| Version:             | 1.0
| Notes:               | none
| Description:         | The website must contains a <br> full explanation about the <br> Fourier Series.

<br>
<br>
<br>

| ID                   | Req-01
|----------------------|--------|
| Name:                | Index
| Priority:            | 1
| Version:             | 1.0
| Notes:               | none
| Description:         | The website must contain an index of all the sections.
| **Subrequirements**  |
| Req-01_0             | There must be a section about the topic introduction.
| Req-01_1             | There must be a section about the knowledge requirements.
| Req-01_2             | There must be a section about signal processing.
| Req-01_3             | There must be a section about the fourier transform.
| Req-01_4             | There must be a section about the fourier series.
| Req-01_5             | There must be a section about how to represent the <br> fourier series with epicycles.
| Req-01_6             | There must be a section about how the FFT works.
| Req-01_7             | There must be a section about implementing FFT.

<br>
<br>
<br>

| ID                   | Req-02
|----------------------|--------|
| Name:                | Introduction
| Priority:            | 1
| Version:             | 1.0
| Notes:               | none
| Description:         | The introduction section must contain an interactive Fourier <br> Series animator.
| **Subrequirements**  |
| Req-02_0             | The user must be able to draw an arbitrary path.
| Req-02_1             | The user drawn path is animated with a fourier series, <br> represented with epicycles.
| Req-02_2             | The interactive box must contains a timeline slider.
| Req-02_3             | The interactive box must contain a stop button.
| Req-02_4             | The interactive box must contain a resume button.
| Req-02_5             | The interactive box must contain a slider for the animation speed.

<br>
<br>
<br>

| ID                   | Req-03
|----------------------|--------|
| Name:                | Interactiveness
| Priority:            | 1
| Version:             | 1.0
| Notes:               | none
| Description:         | The website must contain multiple interactive boxes.
| **Subrequirements**  |
| Req-03_0             | All the interactive boxes must follow the design <br> described in Req-02.
| Req-03_1             | All the interactive boxes can contain optional settings.

<br>
<br>
<br>

| ID                   | Req-04
|----------------------|--------|
| Name:                | Modularity
| Priority:            | 1
| Version:             | 1.0
| Notes:               | none
| Description:         | The interactive boxes must share the same base code.

<br>
<br>
<br>

| ID                   | Req-05
|----------------------|--------|
| Name:                | Responsiveness
| Priority:            | 2
| Version:             | 1.0
| Notes:               | none
| Description:         | The website must be responsive.