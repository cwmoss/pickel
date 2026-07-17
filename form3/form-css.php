<?php

$css = file_get_contents(__DIR__ . "/form.css");

$tpl = <<<ETPL
import { LitElement, css, html, live } from "./lit-all.min.js";

export const formcss = css`$css`
ETPL;

print $tpl;
